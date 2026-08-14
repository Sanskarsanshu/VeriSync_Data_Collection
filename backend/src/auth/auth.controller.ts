import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token } = await this.authService.login(user);

    // Set the HttpOnly cookie — sameSite 'none' is required for Vercel -> Render cross-domain requests
    response.cookie('verisync_session', access_token, {
      httpOnly: true,
      secure: true, // Must be true when sameSite is 'none'
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Fetch display name for the response so the frontend can populate the store
    const me = await this.authService.getMe(user.id);

    return {
      message: 'Logged in successfully',
      ...me,
      access_token,
    };
  }

  /**
   * GET /api/auth/me
   * Protected by the HttpOnly JWT cookie.
   * The frontend calls this on every protected page mount to:
   *   1. Verify the session is still valid
   *   2. Re-hydrate the Zustand store (role, name) after a hard refresh
   * Returns 401 if cookie is missing/expired → triggers redirect to /login
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const jwtUser = (req as any).user as {
      userId: string;
      email: string;
      role: string;
    };
    return this.authService.getMe(jwtUser.userId);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('verisync_session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }
}
