import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { ContactModule } from '../contacts/contact.module';
import { BotAuthEntity } from './entities/bot-auth.entity';
import { BotAUthController } from './auth/bot-auth.controller';
import { BotAuthService } from './auth/bot-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotEntity, BotAuthEntity]),
    ContactModule
  ],
  controllers: [BotController, BotAUthController],
  providers: [BotService, BotAuthService],
  exports: [BotService]
})
export class BotModule {}
