import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

const AVATAR_COLORS = ['#2F6F5E','#B4517A','#5B6FD6','#C77B3B','#3F8FBF','#7A5FBF','#4E8B5A'];

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getStudentDashboardData(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        section: {
          include: {
            semester: true,
            courses: {
              include: {
                subject: true,
                primaryTeacher: true
              }
            }
          }
        },
        attendanceRecords: {
          include: {
            session: {
              include: {
                scheduledClass: {
                  include: {
                    course: {
                      include: {
                        subject: true,
                        primaryTeacher: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { markedAt: 'desc' },
        }
      }
    });

    if (!student) {
      throw new Error('Student profile not found for this user');
    }

    // 1. Attendance Calculations
    const totalMarkedRecords = student.attendanceRecords.length;
    const attendedRecords = student.attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const absentRecords = totalMarkedRecords - attendedRecords;
    
    // Safety check: Avoid NaN (0/0)
    const attendancePercentage = totalMarkedRecords > 0 
      ? Math.round((attendedRecords / totalMarkedRecords) * 100) 
      : 0;

    // 2. Today's Schedule (Timetable representation for today)
    // We will find today's classes from attendance sessions or simulate from courses for now if timetable isn't fully seeded.
    // Wait, the user specifically said: "Only timetable entries for today's day/date. Use actual timetable/academic schedule data if it exists."
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayScheduledClasses = await this.prisma.scheduledClass.findMany({
      where: {
        course: { sectionId: student.sectionId },
        date: { gte: startOfDay, lte: endOfDay }
      },
      include: {
        course: {
          include: {
            subject: true,
            primaryTeacher: true
          }
        },
        attendanceSession: {
          include: {
            records: {
              where: { studentId: student.id }
            }
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    const todaySchedule = todayScheduledClasses.map(sc => {
      const session = sc.attendanceSession;
      let computedStatus = 'UPCOMING';
      if (session) {
        if (session.records.length > 0) {
          computedStatus = session.records[0].status;
        } else if (session.status === 'CLOSED') {
          computedStatus = 'MISSED';
        } else {
          computedStatus = session.status;
        }
      } else if (sc.isCancelled) {
        computedStatus = 'CANCELLED';
      }

      return {
        id: sc.id,
        courseName: sc.course.subject.name,
        teacherName: sc.course.primaryTeacher?.name || 'Unknown',
        room: 'TBD', // Schema TimetableRule has room, but ScheduledClass doesn't directly.
        startTime: sc.startTime,
        endTime: sc.endTime,
        status: computedStatus
      };
    });

    // 3. Recent History (Top 5)
    const recentAttendance = student.attendanceRecords.slice(0, 5).map(record => ({
      id: record.id,
      courseName: record.session.scheduledClass.course.subject.name,
      date: record.markedAt.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      status: record.status
    }));

    // 4. Courses (Brief summary)
    const courses = student.section?.courses.map(c => ({
      id: c.id,
      code: c.subject.code,
      name: c.subject.name,
      teacherName: c.primaryTeacher?.name || 'Unassigned'
    })) || [];

    return {
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        semester: student.section?.semester?.semesterNumber || 3
      },
      attendance: {
        percentage: attendancePercentage,
        attended: attendedRecords,
        total: totalMarkedRecords,
        absent: absentRecords
      },
      courses,
      todaySchedule,
      recentAttendance
    };
  }

  async getStudentCourses(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        section: {
          include: {
            courses: {
              include: {
                subject: true,
                primaryTeacher: true
              }
            }
          }
        }
      }
    });

    if (!student) throw new Error('Student not found');

    return student.section?.courses.map(c => ({
      id: c.id,
      code: c.subject.code,
      name: c.subject.name,
      credits: c.subject.credits,
      isPractical: c.subject.isPractical,
      teacherName: c.primaryTeacher?.name || 'Unassigned'
    })) || [];
  }

  async getStudentAttendance(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        attendanceRecords: {
          include: {
            session: {
              include: {
                scheduledClass: {
                  include: {
                    course: {
                      include: {
                        subject: true,
                        primaryTeacher: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { markedAt: 'desc' }
        }
      }
    });

    if (!student) throw new Error('Student not found');

    return student.attendanceRecords.map(r => ({
      id: r.id,
      date: r.markedAt.toISOString(),
      courseCode: r.session.scheduledClass.course.subject.code,
      courseName: r.session.scheduledClass.course.subject.name,
      faculty: r.session.scheduledClass.course.primaryTeacher?.name || 'Unknown',
      time: r.session.scheduledClass.startTime,
      status: r.status,
      method: r.session.verificationMethod || 'MANUAL'
    }));
  }

  async getStudentTimetable(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId }
    });

    if (!student) throw new Error('Student not found');

    const rules = await this.prisma.timetableRule.findMany({
      where: {
        course: { sectionId: student.sectionId }
      },
      include: {
        course: {
          include: {
            subject: true,
            primaryTeacher: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    const timetable = rules.map(rule => ({
      id: rule.id,
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
      room: rule.room || 'TBD',
      courseName: rule.course.subject.name,
      courseCode: rule.course.subject.code,
      teacherName: rule.course.primaryTeacher?.name || 'Unassigned'
    }));

    // Group by DayOfWeek to make it easier for frontend
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const grouped = days.reduce((acc, day) => {
      acc[day] = timetable.filter(t => t.dayOfWeek === day);
      return acc;
    }, {} as Record<string, typeof timetable>);

    return grouped;
  }

  async getActiveSession(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId }
    });
    if (!student) throw new Error('Student not found');

    const activeSession = await this.prisma.attendanceSession.findFirst({
      where: {
        status: 'LIVE',
        scheduledClass: {
          course: { sectionId: student.sectionId }
        }
      },
      include: {
        scheduledClass: {
          include: {
            course: {
              include: { subject: true, primaryTeacher: true }
            }
          }
        },
        records: {
          where: { studentId: student.id }
        }
      }
    });

    if (!activeSession) return null;

    return {
      sessionId: activeSession.id,
      courseName: activeSession.scheduledClass.course.subject.name,
      teacherName: activeSession.scheduledClass.course.primaryTeacher?.name || 'Unknown',
      room: 'TBD',
      verificationMethod: activeSession.verificationMethod,
      alreadyMarked: activeSession.records.length > 0
    };
  }

  async markTestAttendance(userId: string, sessionId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new Error('Student not found');

    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { scheduledClass: { include: { course: true } } }
    });
    if (!session || session.status !== 'LIVE') throw new Error('Session is not active');

    // Section membership validation: student must belong to the session's course section
    if (student.sectionId !== session.scheduledClass.course.sectionId) {
      throw new Error('You are not enrolled in this course section');
    }

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId, studentId: student.id } }
    });

    if (existing) {
      return { success: true, alreadyMarked: true };
    }

    await this.prisma.attendanceRecord.create({
      data: {
        sessionId,
        studentId: student.id,
        status: 'PRESENT',
        verificationMethod: session.verificationMethod || 'FACE',
        markedAt: new Date()
      }
    });

    return { success: true };
  }

  async getStudentAnalytics(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        section: {
          include: {
            courses: {
              include: { subject: true, primaryTeacher: true }
            }
          }
        },
        attendanceRecords: {
          include: {
            session: {
              include: {
                scheduledClass: true
              }
            }
          }
        }
      }
    });

    if (!student) throw new Error('Student not found');

    const totalRecords = student.attendanceRecords.length;
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    student.attendanceRecords.forEach(r => {
      if (r.status === 'PRESENT') presentCount++;
      else if (r.status === 'ABSENT') absentCount++;
      else excusedCount++;
    });

    const overall = {
      presentPct: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
      absentPct: totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0,
      excusedPct: totalRecords > 0 ? (excusedCount / totalRecords) * 100 : 0,
    };

    const courseBreakdown = student.section?.courses.map(course => {
      const courseRecords = student.attendanceRecords.filter(r => r.session.scheduledClass.courseId === course.id);
      const cTotal = courseRecords.length;
      const cPresent = courseRecords.filter(r => r.status === 'PRESENT').length;
      const cPct = cTotal > 0 ? Math.round((cPresent / cTotal) * 100) : 0;
      
      return {
        courseId: course.id,
        courseName: course.subject.name,
        courseCode: course.subject.code,
        teacherName: course.primaryTeacher?.name || 'Unknown',
        percentage: cPct
      };
    }) || [];

    const riskCourses = courseBreakdown.filter(c => c.percentage < 75 && student.attendanceRecords.some(r => r.session.scheduledClass.courseId === c.courseId));

    return {
      overall,
      courseBreakdown,
      riskCourses
    };
  }

  async getStudentProfile(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
        profile: true,
        batch: true,
        section: {
          include: {
            semester: true
          }
        }
      }
    });

    if (!student) throw new Error('Student not found');

    return {
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.user?.email || student.profile?.email || 'Not provided',
      mobileNumber: student.profile?.mobileNumber || 'Not provided',
      dob: student.profile?.dob ? student.profile.dob.toISOString().split('T')[0] : 'Not provided',
      gender: student.profile?.gender || 'Not specified',
      bloodGroup: student.profile?.bloodGroup || 'Not specified',
      photoUrl: student.profile?.photoUrl || null,
      admissionYear: student.profile?.admissionYear || new Date().getFullYear(),
      expectedGraduationYear: student.profile?.expectedGraduationYear || (new Date().getFullYear() + 4),
      batch: student.batch?.name || 'Unassigned Batch',
      semester: student.section?.semester ? `Semester ${student.section.semester.semesterNumber}` : 'Unassigned Semester',
      section: student.section?.name || 'Unassigned Section',
    };
  }

  async updateProfilePhoto(userId: string, photoUrl: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { profile: true }
    });

    if (!student) throw new Error('Student not found');
    
    if (student.profile) {
      await this.prisma.studentProfile.update({
        where: { id: student.profile.id },
        data: { photoUrl }
      });
    } else {
      await this.prisma.studentProfile.create({
        data: {
          studentId: student.id,
          photoUrl
        }
      });
    }

    return { message: 'Profile photo updated successfully', photoUrl };
  }

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: {
        batch: { include: { session: true } },
        section: true,
        user: true,
        profile: { select: { photoUrl: true } },
        attendanceRecords: {
          include: { session: { include: { scheduledClass: { include: { course: { include: { subject: true } } } } } } }
        }
      }
    });

    const MONTHS = ['July','June','May','April','March','February','January'];
    const DAY_COLS = Array.from({length:30}, (_,i)=>String(i+1).padStart(2,'0'));

    return students.map((s, i) => {
      // 1. Build Monthly
      const monthly: any = {};
      MONTHS.forEach(m => monthly[m] = { present: 0, absent: 100 }); // Default 0% present if no data
      
      let totalPresent = 0;
      let totalRecords = 0;

      const recordsByMonth: Record<string, { p: number, a: number }> = {};
      MONTHS.forEach(m => recordsByMonth[m] = { p: 0, a: 0 });

      const matrix: any = {};

      s.attendanceRecords.forEach(record => {
          totalRecords++;
          if (record.status === 'PRESENT') totalPresent++;

          const date = record.markedAt;
          const monthName = date.toLocaleString('default', { month: 'long' });
          if (recordsByMonth[monthName]) {
              if (record.status === 'PRESENT') recordsByMonth[monthName].p++;
              else recordsByMonth[monthName].a++;
          }

          const courseCode = record.session.scheduledClass.course.subject.code;
          if (!matrix[courseCode]) matrix[courseCode] = {};
          if (!matrix[courseCode][monthName]) {
              matrix[courseCode][monthName] = Array(30).fill('0');
          }
          const dayIndex = Math.min(date.getDate() - 1, 29);
          matrix[courseCode][monthName][dayIndex] = record.status === 'PRESENT' ? '1' : '0';
      });

      MONTHS.forEach(m => {
          const stats = recordsByMonth[m];
          const total = stats.p + stats.a;
          if (total > 0) {
              monthly[m] = { present: Math.round((stats.p / total) * 100), absent: Math.round((stats.a / total) * 100) };
          }
      });

      const overallAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

      // Fallback matrix layout so UI doesn't crash if empty
      if (Object.keys(matrix).length === 0) {
          matrix['CC101'] = {};
          MONTHS.forEach(m => matrix['CC101'][m] = Array(30).fill('0'));
      }

      return {
        id: s.id,
        name: s.name,
        roll: s.rollNumber,
        course: 'EC202', // Mocked as we don't have this in student model directly mapped
        examRoll: s.registrationNumber ? s.registrationNumber.replace('PWC', 'EXAM') : '',
        regNo: s.registrationNumber || '',
        session: s.batch && s.batch.session ? `${s.batch.session.startYear}-${s.batch.session.endYear}` : '2025-27',
        classText: s.section ? `MCA, ${s.section.name}` : 'MCA',
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
        status: s.status === 'ACTIVE' ? 'ACTIVE' : 'WARNING',
        verification: s.status === 'ACTIVE' ? 'Verified' : 'Not verified',
        time: '09:00 AM',
        faceEnrolled: true,
        attendance: overallAttendance,
        avatar: s.profile?.photoUrl || undefined,
        monthly,
        matrix,
      };
    });
  }

  async create(data: any) {
    const passwordHash = await bcrypt.hash('Welcome@123', 10);
    const batch = await this.prisma.batch.findFirst();
    const section = await this.prisma.section.findFirst();

    const user = await this.prisma.user.create({
      data: {
        email: data.email || `${data.roll?.toLowerCase() || Date.now()}@pwc.in`,
        passwordHash,
        role: 'STUDENT',
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
        studentProfile: {
          create: {
            batchId: batch?.id || '',
            sectionId: section?.id || '',
            rollNumber: data.roll,
            registrationNumber: data.regNo,
            name: data.name,
            status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
          }
        }
      },
      include: { studentProfile: true }
    });

    return {
      id: user.studentProfile?.id || user.id,
      name: data.name,
      roll: data.roll,
      course: data.course || 'CC101',
      examRoll: data.examRoll,
      regNo: data.regNo,
      session: data.session || '2025-27',
      classText: data.classText || 'MCA',
      color: data.color || '#3b82f6',
      status: data.status,
      verification: data.verification || 'Not verified',
      time: '—',
      faceEnrolled: false,
      attendance: 0
    };
  }

  async update(id: string, data: any) {
    const student = await this.prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        rollNumber: data.roll,
        registrationNumber: data.regNo,
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
      },
      include: { user: true }
    });

    if (data.status) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: { status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING' }
      });
    }

    return {
      id,
      name: data.name || student.name,
      roll: data.roll || student.rollNumber,
      regNo: data.regNo || student.registrationNumber,
      status: data.status,
      // Fallbacks so frontend store merges correctly
      course: data.course,
      examRoll: data.examRoll,
      session: data.session,
      classText: data.classText,
      verification: data.verification
    };
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (student) {
      await this.prisma.user.delete({ where: { id: student.userId } });
    }
    return { success: true };
  }
}

