import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Not, Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { enumRole } from 'src/common/enums/role.enum';


@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity)
    private readonly RoleRepository: Repository<RoleEntity>
  ) {}

  async findAll() {
    return this.RoleRepository.find()
  }

  findOneBy = {

    Uuid: async (uuid: string) => {
      const role = await this.RoleRepository.findOneBy({ uuid })

      if (!role) throw new NotFoundException( ERROR_CODE.NOT_FOUND('rol') )
      return role
    },

    name: async (name: enumRole) => {
      const role = await this.RoleRepository.findOneBy({ name })

      if (!role) throw new NotFoundException( ERROR_CODE.NOT_FOUND('rol') )
      return role
    }

  }
}
