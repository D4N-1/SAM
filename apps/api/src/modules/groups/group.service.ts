import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { GetAllGroupQueryDto } from './dto/get-group.dto';
import { AllResponse } from 'src/common/interfaces/response.type';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CommunityService } from '../communities/community.service';
import { ContactService } from '../contacts/contact.service';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    private readonly communityService: CommunityService,
    private readonly contactService: ContactService
  ) {}


  async findAll(query: GetAllGroupQueryDto): Promise<AllResponse> {
    const { include, page = 1, limit = 10 } = query;

    const relations = include ? include.split(',') : []
    const skip = (page - 1) * limit;

    const [ data, total ] = await this.groupRepository.findAndCount({
      relations: relations.filter( rel => [ 'community', 'owner', 'nameOwner', 'descriptionOwner' ].includes(rel) ),
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
      if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )
        return group;
    }


  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {

    const { communityUid, nameOwnerUid, ownerUid, descriptionOwnerUid, nameTime, creation, ...newData } = createGroupDto;

    const group = await this.groupRepository.findOneBy({ uid: newData.uid })
    if (group) throw new ConflictException( ERROR_CODE.CONFLICT('grupo') )

    const newGroupData: Partial<GroupEntity> = { ...newData }

    const contactUidToValidate = [nameOwnerUid, ownerUid, descriptionOwnerUid].filter(Boolean) as string[];

    if (contactUidToValidate.length > 0) await this.contactService.findIn(contactUidToValidate)

    if (communityUid) newGroupData.communityUid = communityUid;
    if (nameOwnerUid) newGroupData.nameOwnerUid = nameOwnerUid;
    if (ownerUid) newGroupData.ownerUid = ownerUid;
    if (descriptionOwnerUid) newGroupData.descriptionOwnerUid = descriptionOwnerUid;
    if (nameTime) newGroupData.nameTime = new Date(nameTime * 1000);

    newGroupData.creation = new Date(creation * 1000)


    const newGroup = this.groupRepository.create(newGroupData)

    return await this.groupRepository.save(newGroup)

  }


  async update(uid: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOneBy.uid(uid);

    const { communityUid, nameOwnerUid, ownerUid, descriptionOwnerUid, nameTime, creation, ...newData } = updateGroupDto;

    const updateGroupData: Partial<GroupEntity> = { ...newData };

    if (communityUid !== undefined) {
      await this.communityService.findOneBy.uid(communityUid)
      updateGroupData.communityUid = communityUid;
    }

    const contactUidToValidate = [nameOwnerUid, ownerUid, descriptionOwnerUid].filter(Boolean) as string[];

    if (contactUidToValidate.length > 0) await this.contactService.findIn(contactUidToValidate)
    
    if (nameOwnerUid !== undefined) updateGroupData.nameOwnerUid = nameOwnerUid;
    if (ownerUid !== undefined) updateGroupData.ownerUid = ownerUid;
    if (descriptionOwnerUid !== undefined) updateGroupData.descriptionOwnerUid = descriptionOwnerUid;
    if (nameTime !== undefined) updateGroupData.nameTime = new Date(nameTime * 1000);
    if (creation !== undefined) updateGroupData.creation = new Date(creation * 1000)

    const updatedGroup = this.groupRepository.merge(group, updateGroupData);

    return await this.groupRepository.save(updatedGroup);

  }


  async delete(uid: string) {

    const group = await this.findOneBy.uid(uid)

      return {
          message: 'Grupo ELIMINADO',
          data: await this.groupRepository.softRemove(group)
      }
  }

    async recover(uid: string) {

        const group = await this.groupRepository.findOne({
            where: { uid },
            withDeleted: true
        })

        if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )

        if (!group.deletedAt) throw new ConflictException( ERROR_CODE.CONFLICT('grupo', 'El groupo no ha sido eliminado aún') )

        return {
          message: 'Grupo RECUPERADO',
          data: await this.groupRepository.recover(group)
        }
    }

  
}
