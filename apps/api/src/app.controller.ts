import { Controller, Get, HttpCode, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { pipeValidateNumber } from './pipes/app.pipe';

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


  @ApiBody({})
  @Post('/pipe')
  postApp(@Body(pipeValidateNumber) body: { name: string, age: number }) {
    return `Hola ${body.name}, tienes ${body.age} años`
  }
}
