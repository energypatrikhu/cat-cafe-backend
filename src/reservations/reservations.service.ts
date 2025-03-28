import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private db: PrismaService) {}

  async create(userId: number, date: Date) {
    const dateNow = new Date();

    if (date < dateNow) {
      throw new BadRequestException('Invalid date');
    }

    const checkPreviousReservation = await this.db.reservation.findFirst({
      where: {
        active: true,
        userId,
      },
    });

    if (checkPreviousReservation) {
      throw new ForbiddenException('You already have a reservation');
    }

    return this.db.reservation.create({
      data: {
        date,
        User: {
          connect: { id: userId },
        },
      },
    });
  }

  findAll(userId: number) {
    return this.db.reservation.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const reservation = await this.db.user.findUnique({
      where: { id: userId },
      select: { Reservation: { where: { id } } },
    });

    if (!reservation || !reservation.Reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation.Reservation;
  }
}
