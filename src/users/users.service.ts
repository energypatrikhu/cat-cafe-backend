import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'node:crypto';
import type { RegisterUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async findByToken(token: string) {
    const user = await this.db.token.findUnique({
      where: { token },
      select: { User: true },
    });

    if (!user) {
      return null;
    }

    return user.User;
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async createToken(userId: number) {
    const token = randomBytes(64).toString('hex');

    const dbToken = await this.db.token.create({
      data: { token, userId },
    });

    return dbToken.token;
  }

  async deleteToken(token: string) {
    return this.db.token.delete({ where: { token } });
  }

  async register(createUserDto: RegisterUserDto) {
    const checkUser = await this.db.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (checkUser) {
      throw new BadRequestException('User already exists');
    }

    await this.db.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: await hash(createUserDto.password),
      },
    });

    return 'User created';
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
