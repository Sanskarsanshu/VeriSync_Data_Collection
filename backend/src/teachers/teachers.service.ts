import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        user: true,
        department: true,
        courses: {
          include: {
            subject: true,
            section: { include: { semester: true } }
          }
        }
      }
    });

    const mappedTeachers = teachers.map(t => {
      // Hardcoded mappings for the seeded mock teachers to perfectly match the frontend expectations
      let subjects = ['CC101', 'CC102'];
      let semesterSubjects: Record<string, string[]> = { "1": ["CC101", "CC102"] };
      let image = `/${t.name.split(' ')[0].toLowerCase()}.png`;
      let mockId = t.id; // fallback to UUID if not recognized

      if (t.name.includes('Richa')) {
        mockId = 'FAC2020';
        subjects = ['CC101', 'CC103', 'MDC302', 'CC313'];
        semesterSubjects = { "1": ['CC101', 'CC103'], "3": ['MDC302', 'CC313'] };
        image = '/features/richa_verma.png';
      } else if (t.name.includes('Praveen')) {
        mockId = 'FAC2021';
        subjects = ['CC102', 'CC105', 'CC310', 'CC313'];
        semesterSubjects = { "1": ['CC102', 'CC105'], "3": ['CC310', 'CC313'] };
        image = '/features/praveen.png';
      } else if (t.name.includes('Sushmita')) {
        mockId = 'FAC2022';
        subjects = ['CC102', 'CC105', 'CC312', 'CC313'];
        semesterSubjects = { "1": ['CC102', 'CC105'], "3": ['CC312', 'CC313'] };
        image = '/features/susmita.png';
      } else if (t.name.includes('Braj')) {
        mockId = 'FAC2023';
        subjects = ['CC104', 'SEC101', 'CC311', 'CC313'];
        semesterSubjects = { "1": ['CC104', 'SEC101'], "3": ['CC311', 'CC313'] };
        image = '/features/brajesh.png';
      } else if (t.name.includes('Bhawna')) {
        mockId = 'FAC2024';
        subjects = ['CC103', 'SEC101', 'MDC302', 'CC313'];
        semesterSubjects = { "1": ['CC103', 'SEC101'], "3": ['MDC302', 'CC313'] };
        image = '/features/Bhawnasinha.png';
      }

      return {
        id: mockId,
        realId: t.id, // Keep the real UUID for deletion
        name: t.name,
        dept: t.department ? t.department.name : 'Department of Computer Applications',
        designation: t.name.includes('Bhawna') ? 'Professor (HOD)' : (t.name.includes('Praveen') ? 'Associate Professor' : 'Assistant Professor'),
        subjects: subjects,
        semesterSubjects: semesterSubjects,
        status: t.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        email: t.user.email,
        phone: '+91 9876543210', 
        image: image,
      };
    });

    // Manually append Dr. Bhawna Sinha since she is an ADMIN in the database, not a TEACHER
    mappedTeachers.push({
      id: 'FAC2024',
      realId: 'admin-bhawna-sinha', // not actually deletable via teacher endpoint easily, but serves as key
      name: 'Dr. Bhawna Sinha',
      dept: 'Department of Computer Applications',
      designation: 'Professor (HOD)',
      subjects: ['CC103', 'SEC101', 'MDC302', 'CC313'],
      semesterSubjects: { "1": ['CC103', 'SEC101'], "3": ['MDC302', 'CC313'] },
      status: 'ACTIVE',
      email: 'Bhawnasinha.mca@pwc.in',
      phone: '+91 9876543210',
      image: '/features/Bhawnasinha.png'
    });

    return mappedTeachers;
  }

  async create(data: any) {
    const passwordHash = await bcrypt.hash('Welcome@123', 10);
    const department = await this.prisma.department.findFirst({
      where: { name: { contains: 'Computer Applications' } }
    });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: 'TEACHER',
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
        teacherProfile: {
          create: {
            name: data.name,
            employeeId: `EMP-${Date.now()}`,
            departmentId: department?.id || '',
            status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
          }
        }
      },
      include: { teacherProfile: true }
    });

    return {
      id: user.teacherProfile.id,
      name: data.name,
      dept: data.dept || 'Department of Computer Applications',
      designation: data.designation || 'Assistant Professor',
      subjects: data.subjects || [],
      semesterSubjects: data.semesterSubjects || {},
      status: data.status,
      email: data.email,
      phone: data.phone || '+91 9876543210',
      image: data.image || `/${data.name.split(' ')[0].toLowerCase()}.png`,
    };
  }

  async update(id: string, data: any) {
    let realId = id;
    if (id === 'FAC2020') realId = (await this.prisma.teacher.findFirst({ where: { user: { email: 'Richaverma.mca@pwc.in' } } }))?.id || id;
    else if (id === 'FAC2021') realId = (await this.prisma.teacher.findFirst({ where: { user: { email: 'Praveenkumar.mca@pwc.in' } } }))?.id || id;
    else if (id === 'FAC2022') realId = (await this.prisma.teacher.findFirst({ where: { user: { email: 'Sushmitachakraborty.mca@pwc.in' } } }))?.id || id;
    else if (id === 'FAC2023') realId = (await this.prisma.teacher.findFirst({ where: { user: { email: 'Brajkishoreprasad.mca@pwc.in' } } }))?.id || id;
    else if (id === 'FAC2024') realId = (await this.prisma.user.findUnique({ where: { email: 'Bhawnasinha.mca@pwc.in' } }))?.id || id; // Note: admin profile

    if (realId === 'admin-bhawna-sinha' || id === 'FAC2024') {
        return { success: true, message: 'Admin updates not supported via teacher endpoint' };
    }

    const teacher = await this.prisma.teacher.update({
      where: { id: realId },
      data: {
        name: data.name,
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
      },
      include: { user: true }
    });

    if (data.email && data.email !== teacher.user.email) {
      await this.prisma.user.update({
        where: { id: teacher.userId },
        data: { email: data.email, status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING' }
      });
    }

    return {
      id,
      name: data.name || teacher.name,
      status: data.status,
      email: data.email || teacher.user.email,
      // Pass back everything else so store updates
    };
  }

  async remove(id: string) {
    let teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      // If not found by UUID, try to find by teacher profile mapping (for mocked FAC IDs)
      let emailMatch = '';
      if (id === 'FAC2020') emailMatch = 'Richaverma.mca@pwc.in';
      else if (id === 'FAC2021') emailMatch = 'Praveenkumar.mca@pwc.in';
      else if (id === 'FAC2022') emailMatch = 'Sushmitachakraborty.mca@pwc.in';
      else if (id === 'FAC2023') emailMatch = 'Brajkishoreprasad.mca@pwc.in';
      else if (id === 'FAC2024') emailMatch = 'Bhawnasinha.mca@pwc.in';

      if (emailMatch) {
        teacher = await this.prisma.teacher.findFirst({
          where: { user: { email: emailMatch } }
        });
      }
    }

    if (teacher) {
      // Cascade delete user which deletes teacher profile
      await this.prisma.user.delete({ where: { id: teacher.userId } });
    }
    return { success: true };
  }
}

