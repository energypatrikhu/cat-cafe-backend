import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  /**
   * The name of the product
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The description of the product
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * The price of the product
   */
  @IsNumber()
  @IsNotEmpty()
  price: number;

  /**
   * The quantity of the product
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
