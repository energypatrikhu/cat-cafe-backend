import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from '../auth/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new user
   */
  @Post('register')
  @ApiBody({
    type: RegisterUserDto,
    examples: {
      user: {
        value: {
          name: 'Someone Special',
          email: 'someone@example.com',
          password: '@V3Ri$tr0ngP@$$w0rd',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() createUserDto: RegisterUserDto) {
    return this.usersService.register(createUserDto);
  }

  /**
   * Login a user
   */
  @Post('login')
  @ApiBody({
    type: LoginUserDto,
    examples: {
      user: {
        value: {
          email: 'user@cat-cafe.hu',
          password: 'user-pass-123',
        },
      },
      worker: {
        value: {
          email: 'worker@cat-cafe.hu',
          password: 'worker-pass-123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    example: { token: 'example-token' },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  login(@Body() body: LoginUserDto) {
    return this.usersService.login(body);
  }

  /**
   * Logout a user
   */
  @Delete('logout')
  @ApiBody({
    type: LogoutUserDto,
    examples: {
      user: {
        value: {
          token: 'example-token',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  async logout(@Body() body: LogoutUserDto) {
    await this.usersService.logout(body);
    return { message: 'Logout successful' };
  }

  /**
   * Get user information
   */
  @Get('me')
  @ApiResponse({ status: 200, description: 'User information', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  getMe(@Request() req) {
    return this.usersService.getMe(req.user.id);
  }
}
