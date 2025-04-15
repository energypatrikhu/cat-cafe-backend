import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  /**
   * User email address
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * User password
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
