import { IsInt, IsPositive } from 'class-validator';

class BuyProduct {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class BuyProductDto {
  products: BuyProduct[];
}
