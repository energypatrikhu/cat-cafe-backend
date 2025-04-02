import { IsString } from 'class-validator';

export class LogoutUserDto {
  /**
   * User token
   */
  @IsString()
  token: string;
}
