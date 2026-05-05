import { Module } from '@nestjs/common';
import { GendersService } from './genders.service';
import { GendersController } from './genders.controller';
import { GendersEntity } from './entities/gender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GendersEntity])
  ],
  controllers: [GendersController],
  providers: [GendersService],
})
export class GendersModule {}
