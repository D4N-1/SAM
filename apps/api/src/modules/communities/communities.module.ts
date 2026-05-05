import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityEntity } from './entities/community.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityEntity])
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
})
export class CommunitiesModule {}
