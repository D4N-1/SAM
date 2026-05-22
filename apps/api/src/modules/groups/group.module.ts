import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { CommunityModule } from '../communities/community.module';
import { GroupSeederService } from 'src/seeders/group-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    CommunityModule
    ],
  controllers: [GroupController],
  providers: [GroupService, GroupSeederService],
})
export class GroupModule {}
