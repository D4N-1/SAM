import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { GetAllRealmQueryDto } from "./dto/get-realm.dto";
import { AllResponse } from "src/common/interfaces/response.type";
import { RealmService } from "./realm.service";
import { CreateRealmDto } from "./dto/create-realm.dto";
import { API_PARAM } from "src/common/constants/api-param";
import { UpdateRealmDto } from "./dto/update-realm.dto";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { RealmEntity } from "./entities/realm.entity";
import { ERROR_CODE } from "src/common/utils/error.utils";

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

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('reino') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('reino'), type: RealmEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('reino'), schema: { example: ERROR_CODE.NOT_FOUND('reino') } })
    @ApiParam(API_PARAM.NAME)
    @Patch('/:name')
    async update(@Param('name') name: string, @Body() updateUserDto: UpdateRealmDto): Promise<RealmEntity|null> {
        return this.realmService.update(name, updateUserDto)
    }
}