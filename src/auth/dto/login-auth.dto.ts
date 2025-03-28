import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  /**
   * User email address
   */
  @IsEmail()
  email: string;

  /**
   * User password
   */
  @IsString()
  password: string;
}
