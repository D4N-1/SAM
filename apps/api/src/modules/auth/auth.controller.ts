import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() signInDto: CreateAuthDto) {
    return this.authService.signIn(signInDto.uid, signInDto.password)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  profile(@Request() request) {
    return this.authService.profile(request.user.uuid)
  }

}
