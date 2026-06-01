import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleSeederService } from '../../seeders/role-seeder.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity])
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleSeederService,
  ],
  exports: [RoleService]
})
export class RoleModule {}
