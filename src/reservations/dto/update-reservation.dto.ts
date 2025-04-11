import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  /**
   * Reservation date
   */
  date: Date;

  /**
   * Is the reservation active?
   */
  active: boolean;
}
