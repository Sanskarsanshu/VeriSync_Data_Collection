import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma.service';

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  attendanceSession: {
    findMany: jest.fn(),
  },
};

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    jest.clearAllMocks();
  });

  it('should return 0 attendance instead of NaN for new student', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({
      id: 'student-1',
      name: 'Test Student',
      rollNumber: '123',
      section: { semester: { semesterNumber: 3 }, courses: [] },
      attendanceRecords: [], // 0 attendance
    });
    mockPrisma.attendanceSession.findMany.mockResolvedValue([]);

    const data = await service.getStudentDashboardData('user-1');
    expect(data.attendance.percentage).toBe(0);
    expect(data.attendance.total).toBe(0);
    expect(data.attendance.attended).toBe(0);
  });

  it('should return correct courses and teacher mappings', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({
      id: 'student-1',
      section: {
        courses: [
          {
            id: 'c1',
            subject: { code: 'CC310', name: 'Web Dev' },
            primaryTeacher: { name: 'Praveen' },
          },
        ],
      },
    });

    const courses = await service.getStudentCourses('user-1');
    expect(courses).toHaveLength(1);
    expect(courses[0].code).toBe('CC310');
    expect(courses[0].teacherName).toBe('Praveen');
  });

  it('should throw error if student tries to access non-existent data (authorization)', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);
    await expect(
      service.getStudentDashboardData('invalid-user'),
    ).rejects.toThrow('Student profile not found for this user');
  });
});
