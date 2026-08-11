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
  academicInfo: { admissionYear: '2025', expectedGraduationYear: '2027', batchId: 'batch-id', sectionId: 'section-id' },
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

  it('should assign new student to the provided batch and section', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'ACTIVE',
      semester: { batchId: 'batch-id' }
    });

    const result = await service.submitEnrollment(validBody);

    expect(result.success).toBe(true);
    expect(result.studentId).toBe(ACTUAL_STUDENT_ID);
    expect(mockPrisma.section.findUnique).toHaveBeenCalledWith({
      where: { id: 'section-id' },
      include: { semester: { include: { batch: true } } },
    });
  });

  it('should fail safely when no batchId or sectionId is provided', async () => {
    const invalidBody = { ...validBody, academicInfo: { admissionYear: '2025', expectedGraduationYear: '2027' } };
    await expect(service.submitEnrollment(invalidBody)).rejects.toThrow(HttpException);
  });

  it('should fail safely when the selected section does not exist or is inactive', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'INACTIVE',
      semester: { batchId: 'batch-id' }
    });

    await expect(service.submitEnrollment(validBody)).rejects.toThrow(HttpException);
  });

  it('should fail safely when the selected batch does not match the section', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'ACTIVE',
      semester: { batchId: 'different-batch-id' }
    });

    await expect(service.submitEnrollment(validBody)).rejects.toThrow(HttpException);
  });

  it('should write an ENROLLMENT_CREATED audit log inside the transaction', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'ACTIVE',
      semester: { batchId: 'batch-id' }
    });

    await service.submitEnrollment(validBody);

    expect(auditLogCreate).toHaveBeenCalledWith({
      data: {
        action: 'ENROLLMENT_CREATED',
        userId: 'user-id',
        studentId: ACTUAL_STUDENT_ID,
        metadata: expect.objectContaining({
          email: 'test@test.com',
          fullName: 'Test Name',
          rollNumber: '123',
          sectionId: 'section-id',
          batchId: 'batch-id',
          viaToken: false,
        }),
      },
    });
  });

  it('should return 409 Conflict on a duplicate unique constraint (P2002)', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'ACTIVE',
      semester: { batchId: 'batch-id' }
    });
    mockPrisma.$transaction.mockRejectedValue({ code: 'P2002' });

    await expect(service.submitEnrollment(validBody)).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
    });
  });

  it('should return 500 Internal Server Error on unexpected failures', async () => {
    mockPrisma.section.findUnique = jest.fn().mockResolvedValue({
      id: 'section-id',
      status: 'ACTIVE',
      semester: { batchId: 'batch-id' }
    });
    mockPrisma.$transaction.mockRejectedValue(new Error('boom'));

    await expect(service.submitEnrollment(validBody)).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
