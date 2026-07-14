import { Controller, Get, HttpCode, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express'
import { AppService } from './app.service';
import {  ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


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
