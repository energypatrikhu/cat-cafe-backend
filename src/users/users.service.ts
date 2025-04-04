import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

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
      throw new ConflictException('User already exists');
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
      throw new NotFoundException('User not found');
    }

    const isValid = await verify(user.password, loginUserDto.password);

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
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
