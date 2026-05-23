import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { Not, Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { ContactService } from "../contacts/contact.service";
import { AllResponse } from "src/common/types/response.type";


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
                relations: { ownerContact: true }
             })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )

            return community
        },
        uid: async (uid: string): Promise<CommunityEntity> => {
            const community = await this.communityRepository.findOne({
                where: { uid },
                relations: { ownerContact: true }
            })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )
            return community
        }
    }

    async create(createCommunityDto: CreateCommunityDto): Promise<CommunityEntity | null> {

        const { ownerContactUid, ...newData } = createCommunityDto;
        const newCommunityData: Partial<CommunityEntity> = { ...newData }

        const community = await this.communityRepository.findOneBy({ uid: newData.uid });
        if (community) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad') );        

        if (ownerContactUid) {
            const contact = await this.contactService.findOneBy.uid( ownerContactUid )

            const isContactUsed = await this.communityRepository.findOne({
                where: { ownerContact: { index: contact.index }}
            })
            if (isContactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad', 'Ese contacto ya es dueño de otra comunidad') )

            newCommunityData.ownerContact = contact
        }
    
        const newCommunity = this.communityRepository.create(newCommunityData);

        return await this.communityRepository.save(newCommunity);
    }

    async update(uuid: string, updateCommunityDto: UpdateCommunityDto): Promise<CommunityEntity|null> {
        const community = await this.findOneBy.uuid( uuid )

        const updateData: Partial<CommunityEntity> = {}
        if (updateCommunityDto.name) updateData.name = updateCommunityDto.name
        if (updateCommunityDto.description) updateData.description = updateCommunityDto.description
        if (updateCommunityDto.link) updateData.link = updateCommunityDto.link
        if (updateCommunityDto.isPublic) updateData.isPublic = updateCommunityDto.isPublic


        if (updateCommunityDto.uid) {
            const exist = await this.communityRepository.findOne({
                where: { uid: updateCommunityDto.uid, uuid: Not(uuid) }
            })
            if (exist) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad', 'Ese UID ya le pertenece a otra comunidad') )
            updateData.uid = updateCommunityDto.uid
        }

        if (updateCommunityDto.ownerContactUid) {
            const contact = await this.contactService.findOneBy.uid( updateCommunityDto.ownerContactUid )

            const isContactUsed = await this.communityRepository.findOne( {
                where: { ownerContact: { index: contact.index }, uuid: Not(uuid) }
            })

            if (isContactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad', 'Este contacto ya es dueño de otra comunidad') )

            updateData.ownerContact = contact
        }

        const editCommunity = this.communityRepository.merge(community, updateData)
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