import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  /**
   * User name
   */
  @IsString()
  @IsNotEmpty()
  name: string;

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
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
