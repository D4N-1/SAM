import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { ERROR_CODE } from 'src/common/messages/error.message';
import { API_PARAM } from 'src/common/constants/api-param';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ description: 'Lista todos los roles' })
  @ApiOkResponse({ description: 'Lista los roles existentes', type: [RoleEntity] })
  @ApiNotFoundResponse({ description: 'No existen roles creados', schema: { example: ERROR_CODE.NOT_FOUND() } })
  @Get()
  async getAll() {
    return this.rolesService.findAll()
  }

  @ApiOperation({ description: 'Busqueda de un rol' })
  @ApiOkResponse({ description: 'Rol obtenido con exito', type: RoleEntity })
  @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentar', schema: { example: ERROR_CODE.BAD_REQUEST() } })
  @ApiNotFoundResponse({ description: 'No existe ese rol', schema: { example: ERROR_CODE.NOT_FOUND() } })
  @ApiParam(API_PARAM.UUID)
  @Get('/:uuid')
  async get(@Param('uuid', pipeValidateUuid) uuid: string) {
    return this.rolesService.findOneByUuid(uuid)
  }
}
