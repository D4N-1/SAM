import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";


@Injectable()
export class CommunityService {

    constructor(
        @InjectRepository(CommunityEntity)
        private readonly communityRepository: Repository<CommunityEntity>
    ) {}


    findAll(): Promise<CommunityEntity[]|null> {
        return this.communityRepository.find()
    }

    findOneBy = {

        Uuid: async (uuid: string): Promise<CommunityEntity> => {
            const community = await this.communityRepository.findOne({
                where: { uuid },
                relations: { contactOwner: true }
             })

            if (!community) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comunidad') )

            return community
        }
    }

    async create(createCommunityDto: CreateCommunityDto): Promise<CommunityEntity | null> {

        const community = await this.communityRepository.findOneBy({ uid: createCommunityDto.uid });
        if (community) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad') );

        const newCommunity = this.communityRepository.create(createCommunityDto);

        return await this.communityRepository.save(newCommunity);
    }

    async update(uuid: string, updateCommunityDto: UpdateCommunityDto): Promise<CommunityEntity|null> {

        const community = await this.findOneBy.Uuid(uuid)

        if (updateCommunityDto.uid) {
            const exist = await this.communityRepository.findOneBy({ uid: updateCommunityDto.uid })
            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT('comunidad') )
        }

        const editCommunity = this.communityRepository.merge(community, updateCommunityDto)
        return await this.communityRepository.save(editCommunity)
    }

    async delete(uuid: string) {
        const community = await this.findOneBy.Uuid(uuid)

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