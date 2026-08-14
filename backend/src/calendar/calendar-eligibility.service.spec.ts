import { Test, TestingModule } from '@nestjs/testing';
import {
  CalendarEligibilityService,
  AttendanceEligibility,
} from './calendar-eligibility.service';
import { PrismaService } from '../prisma.service';

describe('CalendarEligibilityService', () => {
  let service: CalendarEligibilityService;
  let prismaService: PrismaService;

  const mockPrisma = {
    course: { findUnique: jest.fn() },
    scheduledClass: { findFirst: jest.fn() },
    academicCalendarEvent: { findMany: jest.fn() },
    timetableRule: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarEligibilityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CalendarEligibilityService>(
      CalendarEligibilityService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return CANCELLED if explicitly cancelled', async () => {
    mockPrisma.course.findUnique.mockResolvedValue({
      section: {
        semester: {
          batch: {
            session: { programme: { department: { collegeId: 'c1' } } },
          },
        },
      },
    });
    mockPrisma.scheduledClass.findFirst.mockResolvedValue({
      isCancelled: true,
    });

    const result = await service.checkEligibility('course-1', new Date());
    expect(result).toBe(AttendanceEligibility.CANCELLED);
  });

  it('should return HOLIDAY if it is a holiday and not a special working day', async () => {
    mockPrisma.course.findUnique.mockResolvedValue({
      section: {
        semester: {
          batch: {
            session: { programme: { department: { collegeId: 'c1' } } },
          },
        },
      },
    });
    mockPrisma.scheduledClass.findFirst.mockResolvedValue(null);
    mockPrisma.academicCalendarEvent.findMany.mockResolvedValue([
      { eventType: 'HOLIDAY' },
    ]);

    const result = await service.checkEligibility('course-1', new Date());
    expect(result).toBe(AttendanceEligibility.HOLIDAY);
  });
});
