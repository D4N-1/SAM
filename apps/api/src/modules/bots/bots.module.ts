import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotEntity])
  ],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotModule {}
