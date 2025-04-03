import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService, BearerStrategy],
  exports: [AuthService],
})
export class AuthModule {}
