import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import * as n_crypto from 'node:crypto';

@Injectable()
export class AuthService {
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
    const token = n_crypto.randomBytes(64).toString('hex');

    const dbToken = await this.db.token.create({
      data: { token, userId },
    });

    return dbToken.token;
  }

  async deleteToken(token: string) {
    return this.db.token.delete({ where: { token } });
  }

  async validateToken(token: string) {
    const user = await this.findByToken(token);

    if (user) {
      delete user.password;

      return user;
    }

    return null;
  }
}
