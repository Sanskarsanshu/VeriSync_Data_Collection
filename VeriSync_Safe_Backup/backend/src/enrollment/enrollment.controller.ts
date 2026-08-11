import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('admin/generate-link')
  async generateLink(@Body() body: { targetRollNumber?: string; targetName?: string }) {
    return this.enrollmentService.generateLink(body.targetRollNumber, body.targetName);
  }

  @Get('admin/links')
  async getLinks() {
    return this.enrollmentService.getLinks();
  }

  @Get('verify-token/:token')
  async verifyToken(@Param('token') token: string) {
    return this.enrollmentService.verifyToken(token);
  }

  @Get('metadata')
  async getMetadata() {
    return this.enrollmentService.getMetadata();
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string }) {
    return this.enrollmentService.sendOtp(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string, otp: string }) {
    return this.enrollmentService.verifyOtp(body.email, body.otp);
  }

  @Post('submit')
  async submitEnrollment(@Body() body: any) {
    return this.enrollmentService.submitEnrollment(body);
  }
}
