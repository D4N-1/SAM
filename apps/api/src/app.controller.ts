import { Controller, Get, HttpCode, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import type { interfaceHealth } from './common/types/health.type';
import { pipeValidateNumber } from './pipes/app.pipe';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @HttpCode(200)
  getHealth(): interfaceHealth {
    return this.appService.getHealth();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/pipe')
  postApp(@Body(pipeValidateNumber) body: { name: string, age: number }) {
    return `Hola ${body.name}, tienes ${body.age} años`
  }
}
