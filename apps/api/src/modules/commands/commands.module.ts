import { Module } from '@nestjs/common';
import { CommandService } from './commands.service';
import { CommandController } from './commands.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandEntity])
  ],
  controllers: [CommandController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    CommandService],
})
export class CommandModule {}
