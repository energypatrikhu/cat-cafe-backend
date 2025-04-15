import { IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

class BuyProduct {
  /**
   * Product ID
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  /**
   * Product quantity
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class BuyProductDto {
  /**
   * List of products to buy
   */
  @ValidateNested({ each: true })
  @IsNotEmpty({ each: true })
  products: BuyProduct[];
}
