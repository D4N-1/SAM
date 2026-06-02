import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity, CommunityRelations } from "./entities/community.entity";
import { Not, Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { ContactService } from "../contacts/contact.service";
import { AllResponse } from "src/common/interfaces/response.type";
import { GetAllCommunityQueryDto } from "./dto/get-community.dto";
import { RealmService } from "../realms/realm.service";


@Injectable()
export class CommunityService {

    constructor(
        @InjectRepository(CommunityEntity)
        private readonly communityRepository: Repository<CommunityEntity>,

        private readonly contactService: ContactService,
        private readonly realmService: RealmService
    ) {}


    async findAll(query: GetAllCommunityQueryDto): Promise<AllResponse> {
        const { include, page = 1, limit = 10 } = query;

        const relations = include ? include.split(',') : []
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.communityRepository.findAndCount({
          relations: relations.filter( rel => CommunityRelations.includes(rel) ),
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

        uuid: async (uuid: string): Promise<CommunityEntity> => {
            const community = await this.communityRepository.findOne({
                where: { uuid },
                relations: CommunityRelations
             })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )

            return community
        },
        uid: async (uid: string): Promise<CommunityEntity> => {
            const community = await this.communityRepository.findOne({
                where: { uid },
                relations: CommunityRelations
            })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
            return community
        }
    }

    async create(createCommunityDto: CreateCommunityDto): Promise<CommunityEntity | null> {

        const { ownerUid, descriptionOwnerUid, creation, nameOwnerUid, nameTime, realmName, ...newData } = createCommunityDto;

        const community = await this.communityRepository.findOneBy({ uid: newData.uid });
        if (community) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad') );        

        const newCommunityData: Partial<CommunityEntity> = { ...newData }

        if (realmName) {
            const realm = await this.realmService.findOneBy.name(realmName);
            newCommunityData.realm = realm;
        }

        const contactUidToValidate = [ownerUid, descriptionOwnerUid, nameOwnerUid].filter(Boolean) as string[];

        let validContacts: any[] = [];
        if (contactUidToValidate.length > 0) validContacts = await this.contactService.findIn(contactUidToValidate)
        
        if (ownerUid && validContacts.some( c => c.uid === ownerUid)) newCommunityData.owner = validContacts.find( c => c.uid === ownerUid);
        if (descriptionOwnerUid && validContacts.some( c => c.uid === descriptionOwnerUid)) newCommunityData.descriptionOwner = validContacts.find( c => c.uid === descriptionOwnerUid);
        if (nameOwnerUid && validContacts.some( c => c.uid === nameOwnerUid)) newCommunityData.nameOwner = validContacts.find( c => c.uid === nameOwnerUid);

        if (nameTime) newCommunityData.nameTime = new Date(nameTime * 1_000);

        newCommunityData.creation = new Date(creation * 1_000);

        const newCommunity = this.communityRepository.create(newCommunityData);

        return await this.communityRepository.save(newCommunity);
    }

    async update(uid: string, updateCommunityDto: UpdateCommunityDto): Promise<CommunityEntity|null> {
        const community = await this.findOneBy.uid( uid )

        const { ownerUid, descriptionOwnerUid, nameOwnerUid, creation, nameTime, realmName, ...newData } = updateCommunityDto;

        const updateCommunityData: Partial<CommunityEntity> = { ...newData };        

        if (realmName !== undefined) {
            const realm = await this.realmService.findOneBy.name(realmName);
            updateCommunityData.realm = realm;
        } 

        const contactUidToValidate = [ownerUid, descriptionOwnerUid, nameOwnerUid].filter(Boolean) as string[];

        let validContacts: any[] = [];
        if (contactUidToValidate.length > 0) validContacts = await this.contactService.findIn(contactUidToValidate)
        
        if (ownerUid) updateCommunityData.owner = validContacts.find( c => c.uid === ownerUid);
        if (descriptionOwnerUid) updateCommunityData.descriptionOwner = validContacts.find( c => c.uid === descriptionOwnerUid);
        if (nameOwnerUid) updateCommunityData.nameOwner = validContacts.find( c => c.uid === nameOwnerUid)

        if (nameTime) updateCommunityData.nameTime = new Date(nameTime * 1_000);
        if (creation) updateCommunityData.creation = new Date(creation * 1_000);

        
        if (updateCommunityDto.uid) {

            const exist = await this.communityRepository.findOne({
                where: { uid: updateCommunityDto.uid, index: Not(community.index) }
            })
            if (exist) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad', 'Ese UID ya le pertenece a otra comunidad') )
            updateCommunityData.uid = updateCommunityDto.uid
        }


        const editCommunity = this.communityRepository.merge(community, updateCommunityData)
        return await this.communityRepository.save(editCommunity)
    }

    async delete(uid: string) {
        const community = await this.findOneBy.uid(uid)

        return {
            message: 'Comunidad ELIMINADA',
            community: await this.communityRepository.softRemove(community)
        }
    }

    async recover(uid: string) {
        const communty = await this.communityRepository.findOne({
            where: { uid },
            withDeleted: true
        })

        if (!communty) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
        if (!communty.deletedAt) throw new ConflictException( ERROR_CODE.NOT_FOUND('comunidad') )

        return await this.communityRepository.recover(communty)
    }

}