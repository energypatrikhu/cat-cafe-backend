import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new user.
   */
  @Post('register')
  @ApiBody({
    type: CreateUserDto,
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
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
}
