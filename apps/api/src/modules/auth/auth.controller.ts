import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({})
  @Post('login')
  login(@Body() signInDto: any) {
    return this.authService.signIn(signInDto.uid, signInDto.password)
  }

}
