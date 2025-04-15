import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDto {
  /**
   * User token
   */
  @IsString()
  @IsNotEmpty()
  token: string;
}
