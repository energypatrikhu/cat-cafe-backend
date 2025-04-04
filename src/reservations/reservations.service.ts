import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private db: PrismaService) {}

  async create(userId: number, date: Date) {
    const previousReservation = await this.db.reservation.findFirst({
      where: {
        active: true,
        userId,
      },
    });
    if (previousReservation) {
      throw new ForbiddenException('You already have a reservation');
    }

    return this.db.reservation.create({
      data: {
        date,
        User: {
          connect: { id: userId },
        },
      },
      select: {
        id: true,
        date: true,
        active: true,
      },
    });
  }

  findAll(userId: number) {
    return this.db.reservation.findMany({
      where: { userId },
      select: { id: true, date: true, active: true },
    });
  }

  async findOne(userId: number, id: number) {
    const reservation = await this.db.user.findUnique({
      where: { id: userId },
      select: { Reservation: { where: { id } } },
    });

    if (!reservation || !reservation.Reservation) {
      throw new NotFoundException('Reservation not found');
    }

    delete reservation.Reservation[0].userId;
    return reservation.Reservation[0];
  }

  async update(
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    if (!updateReservationDto.userId) {
      throw new ForbiddenException('User ID is required');
    }

    const reservation = await this.db.reservation.findFirst({
      where: {
        id: reservationId,
        userId: updateReservationDto.userId,
      },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.db.reservation.update({
      where: { id: reservationId },
      data: updateReservationDto,
    });
  }

  async remove(reservationId: number) {
    const reservation = await this.db.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.db.reservation.delete({
      where: { id: reservationId },
    });

    return 'Reservation deleted';
  }
}
