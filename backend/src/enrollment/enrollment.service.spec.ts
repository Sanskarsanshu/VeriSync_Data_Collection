import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const auditLogCreate = jest.fn().mockResolvedValue({ id: 'audit-id' });
const ACTUAL_STUDENT_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

const mockPrisma = {
  section: {
    findMany: jest.fn(),
  },
  course: {
    count: jest.fn(),
  },
  $transaction: jest.fn((cb: any) =>
    cb({
      user: { create: jest.fn().mockResolvedValue({ id: 'user-id' }) },
      student: { create: jest.fn().mockResolvedValue({ id: ACTUAL_STUDENT_ID }) },
      enrollmentToken: { update: jest.fn() },
      auditLog: { create: auditLogCreate },
    }),
  ),
};

const validBody = {
  personalInfo: {
    email: 'test@test.com',
    password: 'password',
    fullName: 'Test Name',
    rollNumber: '123',
  },
  academicInfo: { admissionYear: '2025', expectedGraduationYear: '2027' },
  faceEmbedding: [],
};

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cb: any) =>
      cb({
        user: { create: jest.fn().mockResolvedValue({ id: 'user-id' }) },
        student: { create: jest.fn().mockResolvedValue({ id: ACTUAL_STUDENT_ID }) },
        enrollmentToken: { update: jest.fn() },
        auditLog: { create: auditLogCreate },
      }),
    );
  });

  it('should assign new student to the canonical Semester 3 section and ignore frontend sectionId', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'canonical-section', semester: { batchId: 'batch-id', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(5);

    const result = await service.submitEnrollment(validBody);

    expect(result.success).toBe(true);
    expect(result.studentId).toBe(ACTUAL_STUDENT_ID);
    expect(mockPrisma.section.findMany).toHaveBeenCalledWith({
      where: {
        name: 'Section A',
        status: 'ACTIVE',
        semester: {
          semesterNumber: 3,
          status: 'ACTIVE',
          batch: { status: 'ACTIVE', session: { status: 'ACTIVE' } },
        },
      },
      include: { semester: true },
    });
  });

  it('should return the actual persisted Student id, not a synthetic value', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'canonical-section', semester: { batchId: 'batch-id', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(5);

    const result = await service.submitEnrollment(validBody);

    // The response id must be exactly the id of the Student record created inside the transaction.
    expect(result.studentId).toBe(ACTUAL_STUDENT_ID);
    expect(result.studentId).not.toMatch(/^STD/);
  });

  it('should resolve the single section that has courses when multiple ACTIVE Sem-3 sections exist', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'empty-section', semester: { batchId: 'batch1', semesterNumber: 3 } },
      { id: 'canonical-section', semester: { batchId: 'batch2', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(6);

    const result = await service.submitEnrollment(validBody);

    expect(result.success).toBe(true);
    expect(mockPrisma.course.count).toHaveBeenCalledWith({ where: { sectionId: 'empty-section' } });
    expect(mockPrisma.course.count).toHaveBeenCalledWith({ where: { sectionId: 'canonical-section' } });
  });

  it('should fail safely when no ACTIVE Semester 3 Section A exists', async () => {
    mockPrisma.section.findMany.mockResolvedValue([]);

    await expect(service.submitEnrollment(validBody)).rejects.toThrow(HttpException);
  });

  it('should fail safely when no canonical section has courses', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'section1', semester: { batchId: 'batch1', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(0);

    await expect(service.submitEnrollment(validBody)).rejects.toThrow(HttpException);
  });

  it('should fail safely when multiple canonical sections have courses', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'section1', semester: { batchId: 'batch1', semesterNumber: 3 } },
      { id: 'section2', semester: { batchId: 'batch2', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(3);

    await expect(service.submitEnrollment(validBody)).rejects.toThrow(HttpException);
  });

  it('should write an ENROLLMENT_CREATED audit log inside the transaction', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'canonical-section', semester: { batchId: 'batch-id', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(5);

    await service.submitEnrollment(validBody);

    expect(auditLogCreate).toHaveBeenCalledWith({
      data: {
        action: 'ENROLLMENT_CREATED',
        userId: 'user-id',
        studentId: ACTUAL_STUDENT_ID,
        metadata: expect.objectContaining({
          email: 'test@test.com',
          rollNumber: '123',
          sectionId: 'canonical-section',
          batchId: 'batch-id',
          viaToken: false,
        }),
      },
    });
  });

  it('should return 409 Conflict on a duplicate unique constraint (P2002)', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'canonical-section', semester: { batchId: 'batch-id', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(5);
    mockPrisma.$transaction.mockRejectedValue({ code: 'P2002' });

    await expect(service.submitEnrollment(validBody)).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
    });
  });

  it('should return 500 Internal Server Error on unexpected failures', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'canonical-section', semester: { batchId: 'batch-id', semesterNumber: 3 } },
    ]);
    mockPrisma.course.count.mockResolvedValue(5);
    mockPrisma.$transaction.mockRejectedValue(new Error('boom'));

    await expect(service.submitEnrollment(validBody)).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
