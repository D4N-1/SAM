import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BotsService {
  
  constructor(
    @InjectRepository(BotEntity)
    private readonly botRepository: Repository<BotEntity>
  ) {}


  async findAll(): Promise<BotEntity[]|[]> {
    return this.botRepository.find()
  }

}
