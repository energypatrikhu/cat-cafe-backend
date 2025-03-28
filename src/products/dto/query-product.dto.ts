import { IsIn, IsOptional } from 'class-validator';

export class QueryProductDto {
  /**
   * Search for a product by name
   * @example 'őrölt kávé'
   */
  @IsOptional()
  search?: string;

  /**
   * Sort the products by name or price
   * @example 'name'
   */
  @IsOptional()
  @IsIn(['name', 'price'])
  order?: 'name' | 'price';

  /**
   * Sort the products in ascending or descending order
   * @example 'asc'
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc';
}
