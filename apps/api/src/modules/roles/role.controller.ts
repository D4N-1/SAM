import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { API_PARAM } from 'src/common/constants/api-param';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { Private } from 'src/decorators/private.decorator';
import { Roles } from 'src/decorators/roles-user.decorator';
import { enumRole } from 'src/common/enums/role.enum';


@Private() @ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('roles') })
  @ApiOkResponse({ description: SWAGGER.OK.ALL('roles'), type: [RoleEntity] })
  @Get()
  async getAll() {
    return this.rolesService.findAll()
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('rol') })
  @ApiOkResponse({ description: SWAGGER.OK.FIND('rol'), type: RoleEntity })
  @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('rol'), schema: { example: ERROR_CODE.NOT_FOUND('rol') } })
  @ApiParam(API_PARAM.UUID)
  @Get('uuid/:uuid')
  async getUuid(@Param('uuid', pipeValidateUuid) uuid: string) {
    return this.rolesService.findOneBy.uuid(uuid)
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('rol') })
  @ApiOkResponse({ description: SWAGGER.OK.FIND('rol'), type: RoleEntity })
  @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('rol'), schema: { example: ERROR_CODE.NOT_FOUND('rol') } })
  @ApiParam(API_PARAM.NAME)
  @Get('name/:name')
  async get(@Param('name') name: enumRole) {
    return this.rolesService.findOneBy.name(name)
  }
}
