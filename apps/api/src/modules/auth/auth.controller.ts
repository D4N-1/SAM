import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({})
  @Post('login')
  login(@Body() signInDto: any) {
    return this.authService.signIn(signInDto.uid, signInDto.password)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  profile(@Request() request) {
    return request.user
  }

}
