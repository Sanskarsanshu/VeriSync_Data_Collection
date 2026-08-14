import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from './roles.decorator';
import * as jwt from 'jsonwebtoken';

/**
 * Role-based authorization guard.
 * Registered globally (APP_GUARD). Routes that carry NO @Roles metadata
 * are allowed through; routes annotated with @Roles('ADMIN') etc. require
 * the authenticated user's role (from the verified JWT) to match.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private reflector: Reflector,
    config: ConfigService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET is not configured. Set JWT_SECRET in the environment before starting the server.',
      );
    }
    this.jwtSecret = secret;
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let user = request.user;

    // If JwtAuthGuard hasn't run yet (route-scoped), extract user from token manually
    if (!user) {
      const authHeader = request.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, this.jwtSecret) as any;
          user = {
            userId: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };
          request.user = user; // Populate for downstream handlers
        } catch {
          return false;
        }
      }
    }

    if (!user || !user.role) {
      return false;
    }

    return roles.includes(user.role);
  }
}
