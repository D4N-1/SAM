import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { API_PARAM } from 'src/common/constants/api-param';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { SWAGGER } from 'src/common/utils/swagger.utils';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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
  @Get('/:uuid')
  async get(@Param('uuid', pipeValidateUuid) uuid: string) {
    return this.rolesService.findOneByUuid(uuid)
  }
}
