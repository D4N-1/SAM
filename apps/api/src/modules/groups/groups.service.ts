import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { CommunityService } from '../communities/community.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    private readonly communityService: CommunityService
  ) {}


  async findAll(): Promise<GroupEntity[]|[]> {
    return this.groupRepository.find()
  }

  findOneBy = {

    uuid: async (uuid: string): Promise<GroupEntity> => {
          const group = await this.groupRepository.findOne({
              where: { uuid },
              relations: { community: true }
           })
          if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
          return group
      },
  }

  
}
