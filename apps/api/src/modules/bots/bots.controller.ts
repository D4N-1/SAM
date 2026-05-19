import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  
  @Get()
  findAll() {
    return this.botsService.findAll();
  }

}
