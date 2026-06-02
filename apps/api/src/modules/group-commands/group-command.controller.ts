import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { AllResponse } from "src/common/interfaces/response.type";
import { API_PARAM } from "src/common/constants/api-param";
import { SWAGGER } from "src/common/utils/swagger.utils";import { ERROR_CODE } from "src/common/utils/error.utils";
import { Private } from "src/decorators/private.decorator";
import { Roles } from "src/decorators/roles-user.decorator";
import { enumRole } from "src/common/enums/role.enum";
import { GroupCommandService } from "./group-command.service";
import { GroupExistsPipe } from "src/pipes/group.pipe";
import { GroupEntity } from "../groups/entities/group.entity";
import { GetAllGroupCommandQueryDto } from "./dto/get-group-command.dto";
import { CreateGroupCommandDto } from "./dto/create-group-command.dto";
import { GroupCommandEntity } from "./entities/group-command.entity";
import { UpdateGroupCommandDto } from "./dto/update-group-command.dto";


@Private() @Roles([ enumRole.ADMIN ]) @ApiBearerAuth()
@ApiParam(API_PARAM.UID)
@ApiTags('Comandos de Grupo')
@Controller('groups/:uid/commands')
export class GroupCommandController {

    constructor(
        private readonly groupCommandService: GroupCommandService
    ) {}


    @Get()
    async getAll(@Param('uid', GroupExistsPipe) group: GroupEntity, @Query() query: GetAllGroupCommandQueryDto): Promise<AllResponse> {
        return this.groupCommandService.findAll(group, query)
    }

    @Post()
    async post(@Param('uid') realmName: string, @Body() createRealmDto: CreateGroupCommandDto) {
        return this.groupCommandService.create(realmName, createRealmDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('comando del grupo') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('comando del grupo'), type: GroupCommandEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comando del grupo'), schema: { example: ERROR_CODE.NOT_FOUND('comando del grupo') } })
    @ApiParam(API_PARAM.NAME)
    @Patch(':name')
    async update(
        @Param('uid', GroupExistsPipe) group: GroupEntity,
        @Param('name') commandName: string,
        @Body() updateRealmCommandDto: UpdateGroupCommandDto
    ): Promise<GroupCommandEntity|null> {
        return this.groupCommandService.update(group, commandName, updateRealmCommandDto)
    }

}