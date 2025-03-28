import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { LoginAuthDto } from './dto/login-auth.dto';
import { verify } from 'argon2';
import type { LogoutAuthDto } from './dto/logout-auth.dto';

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

  async login(createAuthDto: LoginAuthDto) {
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

  async logout(destroyAuthDto: LogoutAuthDto) {
    return this.userService.deleteToken(destroyAuthDto.token);
  }
}
