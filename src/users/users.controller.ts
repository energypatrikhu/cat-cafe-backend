import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { BearerAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new user.
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
  @ApiResponse({
    status: 201,
    description: 'User created',
    example: 'User created',
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    example: 'User already exists',
  })
  register(@Body() createUserDto: RegisterUserDto) {
    return this.usersService.register(createUserDto);
  }

  /**
   * Get own user information.
   */
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  getMe(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getMe(userId);
  }
}
