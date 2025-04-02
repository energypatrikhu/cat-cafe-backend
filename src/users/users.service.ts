import { AuthService } from '../auth/auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { verify } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    private db: PrismaService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const checkUser = await this.db.user.findUnique({
      where: { email: registerUserDto.email },
    });

    if (checkUser) {
      throw new BadRequestException('User already exists');
    }

    await this.db.user.create({
      data: {
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: await hash(registerUserDto.password),
      },
    });

    return 'User created';
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.authService.findByEmail(loginUserDto.email);

    if (!user) {
      return null;
    }

    const isValid = await verify(user.password, loginUserDto.password);

    if (!isValid) {
      return null;
    }

    const token = await this.authService.createToken(user.id);

    return { token };
  }

  logout(logoutUserDto: LogoutUserDto) {
    return this.authService.deleteToken(logoutUserDto.token);
  }

  getMe(userId: number) {
    return this.db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });
  }
}
