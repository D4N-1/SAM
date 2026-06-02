import { Module } from '@nestjs/common';
import { CommandService } from './commands.service';
import { CommandController } from './commands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';
import { CommandSeederService } from 'src/seeders/command-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandEntity])
  ],
  controllers: [CommandController],
  providers: [
    CommandService, CommandSeederService
  ],
  exports: [ CommandService ]
})
export class CommandModule {}
