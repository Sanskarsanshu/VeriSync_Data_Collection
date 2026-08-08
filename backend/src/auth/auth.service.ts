import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Account is not active.');
      }
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Resolves the display name for the authenticated user.
   * Checks adminProfile first, then teacherProfile.
   * Called by the /auth/me endpoint to restore session on page load.
   */
  async getMe(userId: string): Promise<{ id: string; email: string; role: string; name: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminProfile: { select: { name: true } },
        teacherProfile: { select: { name: true } },
        studentProfile: { select: { name: true, rollNumber: true, id: true } },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session invalid or account inactive.');
    }

    const name =
      user.adminProfile?.name ??
      user.teacherProfile?.name ??
      user.studentProfile?.name ??
      user.email;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name,
      studentId: user.studentProfile?.id,
      rollNumber: user.studentProfile?.rollNumber,
    };
  }
}
