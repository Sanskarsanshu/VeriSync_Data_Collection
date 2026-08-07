import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        programme: { include: { department: true } }
      }
    });

    return subjects.map(s => {
      return {
        id: s.id,
        code: s.code,
        name: s.name,
        credits: s.credits,
        type: s.isPractical ? 'Practical' : 'Theory',
        category: s.code.startsWith('CC') ? 'Core' : (s.code.startsWith('SEC') ? 'SEC' : 'Elective'),
        semester: 'Sem-I', // Mocked as we don't have this link in schema without courses
        weeklyClasses: s.credits, // Fallback
        dept: s.programme.department.name,
        status: 'Active',
        createdAt: new Date(),
      };
    });
  }

  async create(data: any) {
    const programme = await this.prisma.programme.findFirst();
    const subject = await this.prisma.subject.create({
      data: {
        code: data.code,
        name: data.name,
        credits: typeof data.credits === 'string' ? parseInt(data.credits, 10) || 3 : data.credits || 3,
        isPractical: data.type === 'Practical' || data.type === 'Theory + Practical',
        programmeId: programme?.id || ''
      }
    });

    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      type: data.type || 'Theory',
      category: data.category || 'Core',
      semester: '1',
      weeklyClasses: 4,
      dept: 'MCA',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      endDate: '-'
    };
  }

  async update(id: string, data: any) {
    const subject = await this.prisma.subject.update({
      where: { id },
      data: {
        name: data.name,
        credits: typeof data.credits === 'string' ? parseInt(data.credits, 10) || 3 : data.credits,
        isPractical: data.type ? (data.type === 'Practical' || data.type === 'Theory + Practical') : undefined
      }
    });
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      type: subject.isPractical ? 'Theory + Practical' : 'Theory',
      category: data.category || 'Core',
      semester: data.semester || '1',
      weeklyClasses: data.weeklyClasses || 4,
      dept: data.dept || 'MCA',
      status: data.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      endDate: data.endDate || '-'
    };
  }

  async remove(id: string) {
    await this.prisma.subject.delete({ where: { id } });
    return { success: true };
  }
}

