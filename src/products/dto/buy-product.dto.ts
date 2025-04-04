import { IsInt, IsPositive, ValidateNested } from 'class-validator';

class BuyProduct {
  /**
   * Product ID
   */
  @IsInt()
  @IsPositive()
  id: number;

  /**
   * Product quantity
   */
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class BuyProductDto {
  /**
   * List of products to buy
   */
  @ValidateNested({ each: true })
  products: BuyProduct[];
}
