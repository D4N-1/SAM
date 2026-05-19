import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { ContactModule } from '../contacts/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotEntity]),
    ContactModule
  ],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotModule {}
