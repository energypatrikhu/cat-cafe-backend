import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateReservationDto {
  /**
   * Reservation date
   */
  @IsDate()
  @Type(() => Date)
  date: Date;
}
