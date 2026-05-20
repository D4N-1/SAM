import { Controller, Get, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { BotEntity } from './entities/bot.entity';
import { ERROR_CODE } from 'src/common/utils/error.utils';

@Controller('bots')
export class BotController {
  constructor(private readonly botsService: BotService) {}

  @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('bots') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('bots'), type: [BotEntity] })
  @Get()
  findAll() {
    return this.botsService.findAll();
  }


  @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('bot') })
  @ApiOkResponse({ description: SWAGGER.OK.CREATE('bot'), type: BotEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto)
  }
  
}
