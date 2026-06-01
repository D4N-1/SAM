import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupEntity } from './entities/group.entity';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { CreateGroupDto } from './dto/create-group.dto';
import { API_PARAM } from 'src/common/constants/api-param';
import { GetAllGroupQueryDto } from './dto/get-group.dto';
import { AllResponse } from 'src/common/interfaces/response.type';
import { Private } from 'src/decorators/private.decorator';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from 'src/decorators/roles-user.decorator';
import { enumRole } from 'src/common/enums/role.enum';
import { SkipThrottle } from '@nestjs/throttler';


@SkipThrottle()
@Private() @Roles([ enumRole.ADMIN ]) @ApiBearerAuth()
@ApiTags('Grupos')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('grupos') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('grupos'), type: [GroupEntity] } )
  @Get()
  async getAll(@Query() query: GetAllGroupQueryDto): Promise<AllResponse> {
    return this.groupService.findAll(query)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UUID)
  @Get('/uuid/:uuid')
  async getUuid(@Param('uuid', pipeValidateUuid) uuid: string): Promise<GroupEntity> {
    return this.groupService.findOneBy.uuid(uuid)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UID)
  @Get('/uid/:uid')
  async getUid(@Param('uid') uid: string): Promise<GroupEntity> {
    return this.groupService.findOneBy.uid(uid)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('grupo') })
  @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('grupo'), type: GroupEntity })
  @ApiConflictResponse({ description: SWAGGER.CONFLICT('grupo'), schema: { example: ERROR_CODE.CONFLICT('grupo') } })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.EDIT('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UID)
  @Patch('/:uid')
  async edit(@Param('uid') uid: string, @Body() updateGroupDto: UpdateGroupDto): Promise<GroupEntity|null> {
      return this.groupService.update(uid, updateGroupDto)
  }


  @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.DELETE('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UID)
  @Delete('/:uid')
  async delete(@Param('uid') uid: string) {
      return this.groupService.delete(uid)
  }
  
  @ApiOperation({ summary: SWAGGER.SUMMARY.RECOVER('grupo') })
  @ApiOkResponse({ description: SWAGGER.OK.RECOVER('grupo'), type: GroupEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('grupo'), schema: { example: ERROR_CODE.NOT_FOUND('grupo') } })
  @ApiParam(API_PARAM.UID)
  @Patch('/recover/:uid')
  async recover(@Param('uid') uid: string) {
      return this.groupService.recover(uid)
  }
}
