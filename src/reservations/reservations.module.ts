import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '../auth/role.guard';
import { PrismaService } from '../prisma.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    PrismaService,
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class ReservationsModule {}
