import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity, GroupRelations } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { GetAllGroupQueryDto } from './dto/get-group.dto';
import { AllResponse } from 'src/common/interfaces/response.type';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CommunityService } from '../communities/community.service';
import { ContactService } from '../contacts/contact.service';
import { RealmService } from '../realms/realm.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { enumCACHE_KEYS } from 'src/common/enums/cache-keys.enum';


@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly communityService: CommunityService,
    private readonly contactService: ContactService,
    private readonly realmService: RealmService
  ) {}


  async findAll(query: GetAllGroupQueryDto): Promise<AllResponse> {
    const { include, page = 1, limit = 10 } = query;

    const relations = include ? include.split(',') : []
    const skip = (page - 1) * limit;

    const [ data, total ] = await this.groupRepository.findAndCount({
      relations: relations.filter( rel => GroupRelations.includes(rel) ),
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
      const cacheKey = enumCACHE_KEYS.GROUP + uuid;

      const cachedGroup = await this.cacheManager.get<GroupEntity>(cacheKey);
      if (cachedGroup) return cachedGroup;


      const group = await this.groupRepository.findOne({
          where: { uuid },
          relations: GroupRelations
      })

      if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )

      const plainGroup = Object.assign({}, group)
      await this.cacheManager.set(cacheKey, plainGroup);

      return group
    },

    uid: async(uid: string): Promise<GroupEntity> => {
      const cacheKey = enumCACHE_KEYS.GROUP + uid;

      const cachedGroup = await this.cacheManager.get<GroupEntity>(cacheKey);
      if (cachedGroup) return cachedGroup;


      const group = await this.groupRepository.findOne({
          where: { uid },
          relations: GroupRelations
      })

      if (!group) throw new NotFoundException( ERROR_CODE.NOT_FOUND('grupo') )

      const plainGroup = Object.assign({}, group)
      await this.cacheManager.set(cacheKey, plainGroup);
      
      return group
    },

  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {

    const { communityUid, nameOwnerUid, ownerUid, descriptionOwnerUid, nameTime, creation, realmName, ...newData } = createGroupDto;

    const group = await this.groupRepository.findOneBy({ uid: newData.uid })
    if (group) throw new ConflictException( ERROR_CODE.CONFLICT('grupo') )

    const newGroupData: Partial<GroupEntity> = { ...newData }


    if (communityUid) {
      const community = await this.communityService.findOneBy.uid(communityUid);
      newGroupData.community = community;
    }

    if (realmName) {
      const realm = await this.realmService.findOneBy.name(realmName)
      newGroupData.realm = realm;
    }

    const contactUidToValidate = [nameOwnerUid, ownerUid, descriptionOwnerUid].filter(Boolean) as string[];

    let validContacts: any[] = [];
    if (contactUidToValidate.length > 0) validContacts = await this.contactService.findIn(contactUidToValidate)

    if (nameOwnerUid ) newGroupData.nameOwner = validContacts.find( c => c.uid === nameOwnerUid);
    if (ownerUid ) newGroupData.owner = validContacts.find( c => c.uid === ownerUid);
    if (descriptionOwnerUid ) newGroupData.descriptionOwner = validContacts.find( c => c.uid === descriptionOwnerUid);
    if (nameTime) newGroupData.nameTime = new Date(nameTime * 1000);

    newGroupData.creation = new Date(creation * 1000)


    const newGroup = this.groupRepository.create(newGroupData)

    return await this.groupRepository.save(newGroup)

  }


  async update(uid: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOneBy.uid( uid );

    const { communityUid, nameOwnerUid, ownerUid, descriptionOwnerUid, nameTime, creation, realmName, ...newData } = updateGroupDto;

    const updateGroupData: Partial<GroupEntity> = { ...newData };

    if (communityUid !== undefined) {
      const community = await this.communityService.findOneBy.uid(communityUid)
      updateGroupData.community = community;
    }

    if (realmName !== undefined) {
      const realm = await this.realmService.findOneBy.name(realmName);
      updateGroupData.realm = realm;
    } 

    const contactUidToValidate = [nameOwnerUid, ownerUid, descriptionOwnerUid].filter(Boolean) as string[];

    let validContacts: any[] = [];
    if (contactUidToValidate.length > 0) validContacts = await this.contactService.findIn(contactUidToValidate)

    if (nameOwnerUid ) updateGroupData.nameOwner = validContacts.find( c => c.uid === nameOwnerUid);
    if (ownerUid ) updateGroupData.owner = validContacts.find( c => c.uid === ownerUid);
    if (descriptionOwnerUid ) updateGroupData.descriptionOwner = validContacts.find( c => c.uid === descriptionOwnerUid);
    if (nameTime !== undefined) updateGroupData.nameTime = new Date(nameTime * 1000);
    if (creation !== undefined) updateGroupData.creation = new Date(creation * 1000)

    const updatedGroup = this.groupRepository.merge(group, updateGroupData);

    await this.cacheManager.del(enumCACHE_KEYS.GROUP + uid)
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
