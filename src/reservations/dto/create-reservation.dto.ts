import { Type } from 'class-transformer';
import { IsDate, MinDate } from 'class-validator';

export class CreateReservationDto {
  /**
   * Reservation date
   */
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  date: Date;
}
