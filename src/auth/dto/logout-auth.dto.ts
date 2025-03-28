import { IsString } from 'class-validator';

export class LogoutAuthDto {
  /**
   * User token
   */
  @IsString()
  token: string;
}
