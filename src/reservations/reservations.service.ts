import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: number, date: Date) {
    const hasActiveReservation = await this.db.reservation.findFirst({
      where: { active: true, userId },
    });

    if (hasActiveReservation) {
      throw new ForbiddenException('You already have a reservation');
    }

    const sameDateReservation = await this.db.reservation.findFirst({
      where: { date },
    });

    if (sameDateReservation) {
      throw new ConflictException('This date is already reserved');
    }

    return this.db.reservation.create({
      data: {
        date,
        User: { connect: { id: userId } },
      },
      select: { id: true, date: true, active: true },
    });
  }

  findAll(userId: number) {
    return this.db.reservation.findMany({
      where: { userId },
      select: { id: true, date: true, active: true },
    });
  }

  async findOne(userId: number, id: number) {
    if (!id) {
      throw new NotFoundException('Reservation ID is required');
    }

    const reservation = await this.db.user.findUnique({
      where: { id: userId },
      select: { Reservation: { where: { id } } },
    });

    if (!reservation?.Reservation?.length) {
      throw new NotFoundException('Reservation not found');
    }

    const [foundReservation] = reservation.Reservation;
    delete foundReservation.userId;
    return foundReservation;
  }

  async update(
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = await this.db.reservation.findFirst({
      where: { id: reservationId },
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

    await this.db.reservation.delete({ where: { id: reservationId } });

    return 'Reservation deleted';
  }
}
