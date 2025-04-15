import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Authenticated } from './auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const authenticationRequired = this.reflector.get(
      Authenticated,
      context.getHandler(),
    );
    if (!authenticationRequired) {
      console.log('[Auth] No authentication required');

      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      console.log('[Auth] User not logged in');
      throw new UnauthorizedException();
    }

    console.log(`[Auth] User logged in: ${request.user.email}`);
    return true;
  }
}
