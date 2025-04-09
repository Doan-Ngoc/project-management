import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogInDto } from './dto/authLogIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  logIn(@Body() authLogInDto: AuthLogInDto) {
    return this.authService.logIn(authLogInDto);
  }
}
