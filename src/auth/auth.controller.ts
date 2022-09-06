import { Controller, Post, Body, UseFilters, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn-dto';
import { SignUpDto } from './dto/signUp.dto';
import { AuthRegisterFilter } from './filters/exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseFilters(AuthRegisterFilter)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(200)
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
