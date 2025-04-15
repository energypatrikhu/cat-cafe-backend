import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  /**
   * User name
   * Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * User email address
   * Must be a valid email format and non-empty.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * User password
   * Must be a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
   */
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}
