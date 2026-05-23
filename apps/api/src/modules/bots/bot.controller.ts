import { Controller, Get, Post, Body, Query, Patch, Param } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { BotEntity } from './entities/bot.entity';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { GetAllBotQueryDto } from './dto/get-bot.dto';
import { AllResponse } from 'src/common/types/response.type';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { UpdateBotDto } from './dto/update-bot.dto';
import { API_PARAM } from 'src/common/constants/api-param';

@Controller('bots')
export class BotController {
  constructor(private readonly botsService: BotService) {}

  @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('bots') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('bots'), type: [BotEntity] })
  @Get()
  findAll(@Query() query: GetAllBotQueryDto): Promise<AllResponse> {
    return this.botsService.findAll(query);
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('bot') })
  @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('bot'), type: BotEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('bot') })
  @ApiOkResponse({ description: SWAGGER.OK.EDIT('bot'), type: BotEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('bot'), schema: { example: ERROR_CODE.NOT_FOUND('bot') } })
  @ApiParam(API_PARAM.UUID)
  @Patch('/:uuid')
  edit(@Param('uuid', pipeValidateUuid) uuid: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botsService.update(uuid, updateBotDto)
  }
}
