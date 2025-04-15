import {
  CanActivate,
  ExecutionContext,
  Injectable,
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
      throw new UnauthorizedException();
    }

    console.log(
      `[Role] User role: "${user.role}" | Required role: "${requiredRole}"`,
    );
    return requiredRole === user.role;
  }
}
