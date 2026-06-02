import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { AllResponse } from "src/common/interfaces/response.type";
import { RealmCommandService } from "./realm-command.service";
import { CreateRealmCommandDto } from "../dto/create-realm-command.dto";
import { API_PARAM } from "src/common/constants/api-param";
import { UpdateRealmCommandDto } from "../dto/update-realm-command.dto";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { RealmCommandEntity } from "../entities/realm-command.entity";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Private } from "src/decorators/private.decorator";
import { Roles } from "src/decorators/roles-user.decorator";
import { enumRole } from "src/common/enums/role.enum";
import { GetAllRealmCommandQueryDto } from "../dto/get-realm-command.dto";
import { RealmExistsPipe } from "src/pipes/realm.pipe";
import { RealmEntity } from "../entities/realm.entity";


@Private() @Roles([ enumRole.ADMIN ]) @ApiBearerAuth()
@ApiParam(API_PARAM.NAME)
@ApiTags('Comandos de Reinos')
@Controller('realms/:name/commands')
export class RealmCommandController {

    constructor(
        private readonly realmCommandService: RealmCommandService
    ) {}


    @ApiParam(API_PARAM.NAME)
    @Get()
    async getAll(@Param('name', RealmExistsPipe) realm: RealmEntity, @Query() query: GetAllRealmCommandQueryDto): Promise<AllResponse> {
        return this.realmCommandService.findAll(realm, query)
    }

    @ApiParam(API_PARAM.NAME)
    @Post()
    async post(@Param('name') realmName: string, @Body() createRealmDto: CreateRealmCommandDto) {
        return this.realmCommandService.create(realmName, createRealmDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('comando del reino') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('comando del reino'), type: RealmCommandEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comando del reino'), schema: { example: ERROR_CODE.NOT_FOUND('comando del reino') } })
    @ApiParam(API_PARAM.NAME)
    @Patch(':name')
    async update(@Param('name', RealmExistsPipe) realm: RealmEntity, @Param('commandName') commandName: string, @Body() updateRealmCommandDto: UpdateRealmCommandDto): Promise<RealmCommandEntity|null> {
        return this.realmCommandService.update(realm, commandName, updateRealmCommandDto)
    }
}