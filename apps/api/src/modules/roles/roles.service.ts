import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';


@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(RoleEntity)
    private readonly RoleRepository: Repository<RoleEntity>
  ) {}

  async findAll() {
    return this.RoleRepository.find()
  }
  
  async findOneByUuid(uuid: string) {
    const role = await this.RoleRepository.findOneBy({ uuid })

    if (!role) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )
    return role
  }
}
