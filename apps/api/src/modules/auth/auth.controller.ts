import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { enumRole } from 'src/common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: CreateAuthDto) {
    return this.authService.login(dto.id, dto.password)
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(enumRole.ADMIN)
  @Get('me')
  me(@Req() req) {
    return this.authService.findOne(req.user.index)
  }
}
