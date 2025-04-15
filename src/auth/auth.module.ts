import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { AuthenticationGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RoleGuard } from './role.guard';

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    PrismaService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
