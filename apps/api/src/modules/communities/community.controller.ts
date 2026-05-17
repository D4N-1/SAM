import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommunityEntity } from "./entities/community.entity";
import { CommunityService } from "./community.service";

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {

    constructor(
        private readonly communityService: CommunityService
    ) {}


    @Get()
    async getAll(): Promise<CommunityEntity[]|null> {
        return this.communityService.findAll()
    }
}