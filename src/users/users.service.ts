import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly db: PrismaService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    const existingUser = await this.db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    await this.db.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    return 'User created';
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.authService.generateToken(user.id);
    return { token };
  }

  async logout(token: string) {
    await this.authService.removeToken(token);
  }

  async getMe(userId: number) {
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
