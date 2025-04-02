import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  /**
   * The name of the product
   */
  @IsString()
  name: string;

  /**
   * The description of the product
   */
  @IsString()
  description: string;

  /**
   * The price of the product
   */
  @IsNumber()
  price: number;

  /**
   * The quantity of the product
   */
  @IsInt()
  @IsPositive()
  quantity: number;
}
