import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { CommunityModule } from '../communities/community.module';
import { ContactModule } from '../contacts/contact.module';
import { RealmModule } from '../realms/realm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    CommunityModule, ContactModule, RealmModule
    ],
  controllers: [ GroupController],
  providers: [ GroupService ],
  exports: [ GroupService ]
})
export class GroupModule {}
