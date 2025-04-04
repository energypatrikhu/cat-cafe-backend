import { IsInt, IsPositive } from 'class-validator';

export class BuyProductDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
