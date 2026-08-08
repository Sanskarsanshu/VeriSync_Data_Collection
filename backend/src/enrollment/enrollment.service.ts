import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async generateLink(targetRollNumber?: string, targetName?: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const enrollmentToken = await this.prisma.enrollmentToken.create({
      data: {
        token,
        targetRollNumber,
        targetName,
        status: 'PENDING',
      },
    });
    
    return {
      link: `/enroll/${token}`,
      tokenId: enrollmentToken.id,
      status: enrollmentToken.status
    };
  }

  async getLinks() {
    return this.prisma.enrollmentToken.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async verifyToken(token: string) {
    const enrollmentToken = await this.prisma.enrollmentToken.findUnique({
      where: { token },
    });

    if (!enrollmentToken) {
      throw new HttpException('Invalid token', HttpStatus.NOT_FOUND);
    }
    
    if (enrollmentToken.status !== 'PENDING') {
      throw new HttpException('Token is already used or expired', HttpStatus.BAD_REQUEST);
    }

    return enrollmentToken;
  }

  async getMetadata() {
    try {
      const batches = await this.prisma.batch.findMany({ 
        include: { 
          session: { 
            include: { 
              programme: { 
                include: { 
                  department: { 
                    include: { college: true } 
                  } 
                } 
              } 
            } 
          } 
        } 
      });
      const semesters = await this.prisma.semester.findMany();
      const sections = await this.prisma.section.findMany();
      return { batches, semesters, sections };
    } catch (e) {
      console.error("Error fetching metadata:", e);
      throw new HttpException('Failed to load academic metadata. Ensure database is initialized.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Temporary in-memory store for OTPs
  private otpStore = new Map<string, { otp: string; expires: number }>();

  async sendOtp(email: string) {
    if (!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it with a 5-minute expiry
    this.otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
    
    console.log(`[DEV OTP] Sent to ${email}: ${otp}`);
    
    // In production, integrate with SendGrid/AWS SES here
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    // For development convenience, always accept 123456
    if (otp === '123456') return { success: true };

    const record = this.otpStore.get(email);
    if (!record) {
      throw new HttpException('No OTP requested or expired', HttpStatus.BAD_REQUEST);
    }

    if (Date.now() > record.expires) {
      this.otpStore.delete(email);
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    if (record.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    this.otpStore.delete(email);
    return { success: true };
  }

  async submitEnrollment(data: any) {
    const { token, personalInfo, academicInfo, faceEmbedding } = data;

    let enrollmentToken: any = null;
    if (token) {
      enrollmentToken = await this.prisma.enrollmentToken.findUnique({
        where: { token },
      });

      if (!enrollmentToken || enrollmentToken.status !== 'PENDING') {
        throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
      }
    }

    const rollNumber = personalInfo.rollNumber;
    const email = personalInfo.email;
    
    if (!personalInfo.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    
    const passwordHash = await bcrypt.hash(personalInfo.password, 10);
    const studentId = `STD${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: email,
            passwordHash: passwordHash,
            role: 'STUDENT',
            status: 'ACTIVE',
          },
        });

        const student = await prisma.student.create({
          data: {
            userId: user.id,
            rollNumber: rollNumber,
            registrationNumber: personalInfo.universityRegistrationNumber,
            name: personalInfo.fullName,
            status: 'ACTIVE',
            batchId: academicInfo.batchId,
            sectionId: academicInfo.sectionId,
            profile: {
              create: {
                dob: personalInfo.dob ? new Date(personalInfo.dob) : null,
                gender: personalInfo.gender,
                mobileNumber: personalInfo.mobileNumber,
                email: personalInfo.email,
                bloodGroup: personalInfo.bloodGroup,
                photoUrl: personalInfo.photoUrl,
                admissionYear: parseInt(academicInfo.admissionYear),
                expectedGraduationYear: parseInt(academicInfo.expectedGraduationYear),
              }
            },
            faceEmbedding: {
              create: {
                embedding: faceEmbedding
              }
            }
          },
        });

        if (enrollmentToken) {
          await prisma.enrollmentToken.update({
            where: { id: enrollmentToken.id },
            data: { status: 'COMPLETED' },
          });
        }

        return { user, student };
      });

      return {
        success: true,
        studentId: studentId,
        name: personalInfo.fullName,
        rollNumber: personalInfo.rollNumber,
      };

    } catch (error) {
      console.error(error);
      throw new HttpException('Enrollment failed. Ensure unique constraints are met.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
