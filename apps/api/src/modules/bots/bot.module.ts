import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { ContactModule } from '../contacts/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotEntity]),
    ContactModule
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService]
})
export class BotModule {}
