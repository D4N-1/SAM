import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CommunityEntity } from "./entities/community.entity";
import { CommunityService } from "./community.service";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { API_PARAM } from "src/common/constants/api-param";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { AllResponse } from "src/common/interfaces/response.type";

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {

    constructor(
        private readonly communityService: CommunityService
    ) {}


    @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('comunidades') })
    @ApiOkResponse({ description: SWAGGER.SUMMARY.ALL('comunidades'), type: [CommunityEntity]})
    @Get()
    async getAll(@Query() query: GetAllQueryDto): Promise<AllResponse> {
        return this.communityService.findAll(query)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('comunidad') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('comunidad'), type: CommunityEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comunidad'), schema: { example: ERROR_CODE.NOT_FOUND('comunidad') } })
    @ApiParam(API_PARAM.UUID)
    @Get('/:uuid')
    async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<CommunityEntity|null> {
        return this.communityService.findOneBy.uuid(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('comunidad') })
    @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('comunidad'), type: CommunityEntity })
    @ApiConflictResponse({ description: SWAGGER.CONFLICT('comunidad'), schema: { example: ERROR_CODE.CONFLICT('comunidad') } })
    @Post()
    async create(@Body() createCommunityDto: CreateCommunityDto): Promise<CommunityEntity|null> {
        return this.communityService.create(createCommunityDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('comunidad') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('comunidad'), type: CommunityEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comunidad'), schema: { example: ERROR_CODE.NOT_FOUND('comunidad') } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/:uuid')
    async edit(@Param('uuid', pipeValidateUuid) uuid: string, @Body() updateCommunityDto: UpdateCommunityDto): Promise<CommunityEntity|null> {
        return this.communityService.update(uuid, updateCommunityDto)
    }
    
    @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('comunidad') })
    @ApiOkResponse({ description: SWAGGER.OK.DELETE('comunidad'), type: CommunityEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comunidad'), schema: { example: ERROR_CODE.NOT_FOUND('comunidad') } })
    @ApiParam(API_PARAM.UUID)
    @Delete('/:uuid')
    async delete(@Param('uuid', pipeValidateUuid) uuid: string) {
        return this.communityService.delete(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.RECOVER('comunidad') })
    @ApiOkResponse({ description: SWAGGER.OK.RECOVER('comunidad'), type: CommunityEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comunidad'), schema: { example: ERROR_CODE.NOT_FOUND('comunidad') } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/recover/:uuid')
    async recover(@Param('uuid', pipeValidateUuid) uuid: string): Promise<CommunityEntity|null> {
        return this.communityService.recover(uuid)
    }
}