import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolesSeederService } from '../seeders/roles.seeder.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity])
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesSeederService],
})
export class RolesModule {}
