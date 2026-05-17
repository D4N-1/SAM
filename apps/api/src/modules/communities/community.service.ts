import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { Repository } from "typeorm";


@Injectable()
export class CommunityService {

    constructor(
        @InjectRepository(CommunityEntity)
        private readonly comunityRepository: Repository<CommunityEntity>
    ) {}


    findAll(): Promise<CommunityEntity[]|null> {
        return this.comunityRepository.find()
    }
}