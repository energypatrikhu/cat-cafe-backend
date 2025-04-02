import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
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
