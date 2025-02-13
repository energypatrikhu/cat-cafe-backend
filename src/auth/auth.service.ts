import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { CreateAuthDto } from './dto/create-auth.dto';
import { verify } from 'argon2';
import type { DestroyAuthDto } from './dto/destroy-auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateToken(token: string) {
    const user = await this.userService.findByToken(token);

    if (user) {
      delete user.password;

      return user;
    }

    return null;
  }

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findByEmail(createAuthDto.email);

    if (!user) {
      return null;
    }

    const isValid = await verify(user.password, createAuthDto.password);

    if (!isValid) {
      return null;
    }

    const token = await this.userService.createToken(user.id);

    return { token };
  }

  async logout(destroyAuthDto: DestroyAuthDto) {
    return this.userService.deleteToken(destroyAuthDto.token);
  }
}
