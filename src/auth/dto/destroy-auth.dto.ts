import { IsString } from 'class-validator';

export class DestroyAuthDto {
  @IsString()
  token: string;
}
