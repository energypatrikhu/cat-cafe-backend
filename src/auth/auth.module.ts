import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { BearerStrategy } from './bearer.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService, BearerStrategy],
  exports: [AuthService],
})
export class AuthModule {}
