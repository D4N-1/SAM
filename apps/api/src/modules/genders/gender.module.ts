import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { GenderEntity } from './entities/gender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenderEntity])
  ],
  controllers: [GenderController],
  providers: [GenderService],
})
export class GenderModule {}
