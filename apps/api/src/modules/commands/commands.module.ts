import { Module } from '@nestjs/common';
import { CommandService } from './commands.service';
import { CommandController } from './commands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandEntity])
  ],
  controllers: [CommandController],
  providers: [
    CommandService],
})
export class CommandModule {}
