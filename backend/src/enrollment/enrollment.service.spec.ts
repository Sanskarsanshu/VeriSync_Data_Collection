import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from '../prisma.service';
import { HttpException } from '@nestjs/common';

const mockPrisma = {
  section: {
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        { provide: PrismaService, useValue: mockPrisma }
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    jest.clearAllMocks();
  });

  it('should assign new student to Semester 3 explicitly and ignore frontend sectionId', async () => {
    // Mock the query for semester 3 section
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'backend-sem3-section', semester: { batchId: 'backend-batch-id', semesterNumber: 3 } }
    ]);
    
    mockPrisma.$transaction.mockResolvedValue({
      user: { id: 'user-id' },
      student: { id: 'student-id' }
    });

    const result = await service.submitEnrollment({
      personalInfo: { email: 'test@test.com', password: 'password', fullName: 'Test Name', rollNumber: '123' },
      academicInfo: { batchId: 'frontend-fake-batch', sectionId: 'frontend-fake-section' },
      faceEmbedding: []
    });

    expect(result.success).toBe(true);
    // Verified implicitly because transaction is executed without throwing the Ambiguity Error
    expect(mockPrisma.section.findMany).toHaveBeenCalledWith({
      where: { semester: { semesterNumber: 3 } },
      include: { semester: true }
    });
  });

  it('should throw error if multiple Semester 3 sections exist (ambiguity check)', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      { id: 'section1', semester: { batchId: 'batch1', semesterNumber: 3 } },
      { id: 'section2', semester: { batchId: 'batch1', semesterNumber: 3 } }
    ]);

    await expect(service.submitEnrollment({
      personalInfo: { email: 'test@test.com', password: 'password', fullName: 'Test Name', rollNumber: '123' },
      academicInfo: { batchId: 'frontend', sectionId: 'frontend' },
      faceEmbedding: []
    })).rejects.toThrow(HttpException);
  });
});
