import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { CommunityService } from '../communities/community.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { GetAllGroupQueryDto } from './dto/get-group.dto';
import { AllResponse } from 'src/common/types/response.type';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    private readonly communityService: CommunityService
  ) {}


  async findAll(query: GetAllGroupQueryDto): Promise<AllResponse> {
    const { include, page = 1, limit = 10 } = query;

    const relations = include ? include.split(',') : []
    const skip = (page - 1) * limit;

    const [ data, total ] = await this.groupRepository.findAndCount({
      relations: relations.filter( rel => [ 'community' ].includes(rel) ),
      skip,
      take: limit,
      order: { index: 'ASC' }
    })

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    }
  }

  findOneBy = {

    uuid: async(uuid: string): Promise<GroupEntity> => {
          const group = await this.groupRepository.findOne({
              where: { uuid },
              relations: { community: true }
           })
          if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )
          return group
    },

    uid: async(uid: string): Promise<GroupEntity> => {
      const group = await this.groupRepository.findOne({
        where: { uid },
        relations: { community: true }
      })
      if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
        return group;
    }


  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {

    const { communityUid, ...newData } = createGroupDto;

    const group = await this.groupRepository.findOneBy({ uid: newData.uid })
    if (group) throw new ConflictException( ERROR_CODE.CONFLICT('grupo') )

    const newGroupData: Partial<GroupEntity> = { ...newData }

    newGroupData.community = await this.communityService.findOneBy.uid(communityUid)

    const newGroup = this.groupRepository.create(newGroupData)

    return await this.groupRepository.save(newGroup)

  }


  async update(uuid: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOneBy.uuid(uuid);

    const { communityUid, ...newData } = updateGroupDto;

    const updateData: Partial<GroupEntity> = { ...newData };

    if (communityUid) {

      const community = await this.communityService.findOneBy.uid(communityUid)

      updateData.community = community
    }

    const updatedGroup = this.groupRepository.merge(group, updateData);

    return await this.groupRepository.save(updatedGroup);

  }

  
}
