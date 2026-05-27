import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { CommunityModule } from '../communities/community.module';
import { GroupSeederService } from 'src/seeders/group-seeder.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ContactModule } from '../contacts/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    CommunityModule, ContactModule
    ],
  controllers: [GroupController],
  providers: [
    GroupService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ],
})
export class GroupModule {}
