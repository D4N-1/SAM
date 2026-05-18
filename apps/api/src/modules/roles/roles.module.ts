import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolesSeederService } from '../../seeders/roles.seeder.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../auth/guards/auth.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity])
  ],
  controllers: [RolesController],
  providers: [
    RoleService,
    RolesSeederService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ],
  exports: [RoleService]
})
export class RoleModule {}
