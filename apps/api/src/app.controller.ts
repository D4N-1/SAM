import { Controller, Get, HttpCode, Post, Body, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { pipeValidateNumber } from './pipes/app.pipe';
import { Private } from './decorators/private.decorator';
import { Roles } from './decorators/roles-user.decorator';
import { enumRole } from './common/enums/role.enum';
import type { Request } from 'express';

@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Obtiene el estado de la API' })
  @ApiOkResponse({ description: 'Recibe el estado del servicio' })
  @Get('/health')
  @HttpCode(200)
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @Private()
  @Roles([ enumRole.ADMIN, enumRole.MODERATOR ])
  @ApiBody({})
  @Post('/pipe')
  postApp(@Body(pipeValidateNumber) body: { name: string, age: number }) {
    return `Hola ${body.name}, tienes ${body.age} años`
  }


  @Get('ip')
debugIp(@Req() req: Request) {
  return {
    rawIp: req.socket.remoteAddress,
    xForwardedFor: req.headers['x-forwarded-for'], // ¿Llega algo aquí?
    isTrust: req.app.get('trust proxy'),
    ip: req.ip,
    ips: req.ips, // Esto te mostrará la cadena completa (IP cliente, IP proxy)
    headers: req.headers['x-forwarded-for']
  };
}
}
