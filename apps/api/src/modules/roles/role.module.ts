import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolesSeederService } from '../../seeders/roles-seeder.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';


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
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [RoleService]
})
export class RoleModule {}
