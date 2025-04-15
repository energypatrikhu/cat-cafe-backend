import {
  CanActivate,
  ExecutionContext,
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get(Role, context.getHandler());
    if (!requiredRole) {
      console.log('[Role] No role required');
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      console.log('[Role] User not found in request');
      throw new PreconditionFailedException();
    }

    return this.checkRole(requiredRole, user.role);
  }

  private checkRole(requiredRole: string, userRole: string): boolean {
    if (requiredRole !== userRole) {
      console.log(
        `[Role] User role "${userRole}" does not match required role "${requiredRole}"`,
      );
      throw new UnauthorizedException();
    }

    console.log(
      `[Role] User role "${userRole}" matches required role "${requiredRole}"`,
    );
    return true;
  }
}
