import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './groups.service';
import { GroupEntity } from './entities/group.entity';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';

@Controller('groups')
export class GroupsController {
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
  @Get('/:uuid')
  async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<GroupEntity> {
    return this.groupsService.findOneBy.uuid(uuid)
  }

}
