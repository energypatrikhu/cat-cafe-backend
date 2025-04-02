import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
  /**
   * User name
   */
  @IsString()
  name: string;

  /**
   * User email address
   */
  @IsEmail()
  email: string;

  /**
   * User password
   */
  @IsString()
  @IsStrongPassword()
  password: string;
}
