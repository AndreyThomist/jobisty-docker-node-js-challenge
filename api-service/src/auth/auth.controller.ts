import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RequestToken } from './dto/request-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }

  @Post('/request-token')
  async requestToken(@Body() data: RequestToken) {
    return this.authService.requestToken(data);
  }
}
