import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { BearerAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login a user by validating their credentials.
   */
  @Post('login')
  @ApiBody({
    type: LoginAuthDto,
    examples: {
      user: {
        value: {
          email: 'someone@example.com',
          password: '@V3Ri$tr0ngP@$$w0rd',
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
    example: {
      token:
        'otv6b4rotb84rv6ot86br3t82r6bo32rtv8bo632b5tv8o62t6b8o57ot86wagzku',
    },
  })
  async login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }

  /**
   * Logout a user by deleting their token.
   */
  @Delete('logout')
  @ApiBody({
    type: LogoutAuthDto,
    examples: {
      user: {
        value: {
          token:
            'otv6b4rotb84rv6ot86br3t82r6bo32rtv8bo632b5tv8o62t6b8o57ot86wagzku',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  async logout(@Body() body: LogoutAuthDto) {
    this.authService.logout(body);
    return 'Logout successful';
  }
}
