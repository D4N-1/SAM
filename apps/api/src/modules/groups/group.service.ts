import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { CommunityService } from '../communities/community.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { GetAllGroupQueryDto } from './dto/get-group.dto';
import { AllResponse } from 'src/common/types/response.type';

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
      order: { index: 'DESC' }
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

    uuid: async (uuid: string): Promise<GroupEntity> => {
          const group = await this.groupRepository.findOne({
              where: { uuid },
              relations: { community: true }
           })
          if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )
          return group
      },
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {

    const newGroupData: Partial<GroupEntity> = { ...createGroupDto }

    const group = await this.groupRepository.findOneBy({ uid: createGroupDto.uid })
    if (group) throw new ConflictException( ERROR_CODE.CONFLICT('grupo') )

    newGroupData.community = await this.communityService.findOneBy.uid(createGroupDto.communityUid)

    const newGroup = this.groupRepository.create(newGroupData)

    return await this.groupRepository.save(newGroup)

  }

  
}
