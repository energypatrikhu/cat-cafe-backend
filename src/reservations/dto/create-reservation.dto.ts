import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';

export class CreateReservationDto {
  /**
   * Reservation date
   */
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  @IsNotEmpty()
  date: Date;
}
