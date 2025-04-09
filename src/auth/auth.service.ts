import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByToken(token: string) {
    const tokenRecord = await this.prisma.token.findUnique({
      where: { token },
      select: { User: true },
    });

    return tokenRecord?.User || null;
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async generateToken(userId: number) {
    const token = crypto.randomBytes(64).toString('hex');

    const createdToken = await this.prisma.token.create({
      data: { token, userId },
    });

    return createdToken.token;
  }

  async removeToken(token: string) {
    return this.prisma.token.delete({ where: { token } });
  }

  async validateToken(token: string) {
    const user = await this.findUserByToken(token);

    if (user) {
      delete user.password;
      return { ...user, token };
    }

    return null;
  }
}
