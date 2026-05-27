import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { Not, Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { ContactService } from "../contacts/contact.service";
import { AllResponse } from "src/common/interfaces/response.type";


@Injectable()
export class CommunityService {

    constructor(
        @InjectRepository(CommunityEntity)
        private readonly communityRepository: Repository<CommunityEntity>,

        private readonly contactService: ContactService
    ) {}


    async findAll(query): Promise<AllResponse> {
        const page = Math.max(1, parseInt( query?.page, 10) || 1);
        const limit = Math.max(1, parseInt( query?.limit, 10) || 10);
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.communityRepository.findAndCount({
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
                relations: { owner: true }
             })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )

            return community
        },
        uid: async (uid: string): Promise<CommunityEntity> => {
            const community = await this.communityRepository.findOne({
                where: { uid },
                relations: { owner: true }
            })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
            return community
        }
    }

    async create(createCommunityDto: CreateCommunityDto): Promise<CommunityEntity | null> {

        const { ownerUid, descriptionOwnerUid, creation, nameOwnerUid, nameTime, ...newData } = createCommunityDto;

        const community = await this.communityRepository.findOneBy({ uid: newData.uid });
        if (community) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad') );        

        const newCommunityData: Partial<CommunityEntity> = { ...newData }

        const contactUidToValidate = [ownerUid, descriptionOwnerUid, nameOwnerUid].filter(Boolean) as string[];

        if (contactUidToValidate.length > 0) await this.contactService.findIn(contactUidToValidate)
        
        if (ownerUid) newCommunityData.ownerUid = ownerUid;
        if (descriptionOwnerUid) newCommunityData.descriptionOwnerUid = descriptionOwnerUid;
        if (nameOwnerUid) newCommunityData.nameOwnerUid = nameOwnerUid;
        if (nameTime) newCommunityData.nameTime = new Date(nameTime * 1_000);

        newCommunityData.creation = new Date(creation * 1_000);

        const newCommunity = this.communityRepository.create(newCommunityData);

        return await this.communityRepository.save(newCommunity);
    }

    async update(uid: string, updateCommunityDto: UpdateCommunityDto): Promise<CommunityEntity|null> {
        const community = await this.findOneBy.uid( uid )

        const { ownerUid, descriptionOwnerUid, nameOwnerUid, creation, nameTime, ...newData } = updateCommunityDto;

        const updateCommunityData: Partial<CommunityEntity> = { ...newData };        

        const contactUidToValidate = [ownerUid, descriptionOwnerUid, nameOwnerUid].filter(Boolean) as string[];

        if (contactUidToValidate.length > 0) await this.contactService.findIn(contactUidToValidate)
        
        if (ownerUid) updateCommunityData.ownerUid = ownerUid;
        if (descriptionOwnerUid) updateCommunityData.descriptionOwnerUid = descriptionOwnerUid;
        if (nameOwnerUid) updateCommunityData.nameOwnerUid = nameOwnerUid;
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

    async delete(uuid: string) {
        const community = await this.findOneBy.uuid(uuid)

        return {
            message: 'Comunidad ELIMINADA',
            community: await this.communityRepository.softRemove(community)
        }
    }

    async recover(uuid: string) {
        const communty = await this.communityRepository.findOne({
            where: { uuid },
            withDeleted: true
        })

        if (!communty) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
        if (!communty.deletedAt) throw new ConflictException( ERROR_CODE.NOT_FOUND('comunidad') )

        return await this.communityRepository.recover(communty)
    }

}