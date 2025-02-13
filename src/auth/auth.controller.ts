import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { DestroyAuthDto } from './dto/destroy-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login a user by validating their credentials.
   */
  @Post('login')
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      user: {
        value: {
          email: 'someone@example.com',
          password: '@V3Ri$tr0ngP@$$w0rd',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    example: {
      token:
        'otv6b4rotb84rv6ot86br3t82r6bo32rtv8bo632b5tv8o62t6b8o57ot86wagzku',
    },
  })
  async login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  /**
   * Logout a user by deleting their token.
   */
  @Post('logout')
  @ApiBody({
    type: DestroyAuthDto,
    examples: {
      user: {
        value: {
          token:
            'otv6b4rotb84rv6ot86br3t82r6bo32rtv8bo632b5tv8o62t6b8o57ot86wagzku',
        },
      },
    },
  })
  async logout(@Body() body: DestroyAuthDto) {
    return this.authService.logout(body);
  }
}
