import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: CreateAuthDto) {
    return this.authService.login(dto.id, dto.password)
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  me() {
    return "Hola"
  }
}
