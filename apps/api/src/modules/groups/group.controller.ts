import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupEntity } from './entities/group.entity';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { CreateGroupDto } from './dto/create-group.dto';
import { API_PARAM } from 'src/common/constants/api-param';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('grupos') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('grupos'), type: [GroupEntity] } )
  @Get()
  async getAll(): Promise<GroupEntity[]|[]> {
    return this.groupsService.findAll()
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UUID)
  @Get('/:uuid')
  async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<GroupEntity> {
    return this.groupsService.findOneBy.uuid(uuid)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.CREATE('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comunidad'), schema: { example: ERROR_CODE.NOT_FOUND('comunidad') } })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto)
  }
}
