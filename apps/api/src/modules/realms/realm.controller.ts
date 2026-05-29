import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetAllRealmQueryDto } from "./dto/get-realm.dto";
import { AllResponse } from "src/common/interfaces/response.type";
import { RealmService } from "./realm.service";
import { CreateRealmDto } from "./dto/create-realm.dto";

@ApiTags('Reinos')
@Controller('realms')
export class RealmController {

    constructor(
        private readonly realmService: RealmService
    ) {}


    @Get()
    async getAll(@Query() query: GetAllRealmQueryDto): Promise<AllResponse> {
        return this.realmService.findAll(query)
    }


    @Post()
    async post(@Body() createRealmDto: CreateRealmDto) {
        return this.realmService.create(createRealmDto)
    }
}