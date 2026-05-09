import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ERROR_CODES } from 'src/common/messages/error.message';


@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(RoleEntity)
    private readonly RoleRepository: Repository<RoleEntity>
  ) {}

  async findAll() {
    return this.RoleRepository.find()
  }
  
  async findOne(uuid: string) {
    const role = await this.RoleRepository.findBy({ uuid })

    if (role.length == 0) throw new NotFoundException( ERROR_CODES.NOT_FOUND() )
    return role[0]
  }
}
