import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupsController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { CommunityModule } from '../communities/community.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    CommunityModule
    ],
  controllers: [GroupsController],
  providers: [GroupService],
})
export class GroupModule {}
