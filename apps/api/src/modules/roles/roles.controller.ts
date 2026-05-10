import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ description: 'Lista todos los roles' })
  @ApiOkResponse({ description: 'Lista de roles obtenida con exito', type: [RoleEntity] })
  @ApiNotFoundResponse({ description: 'No existen roles creados' })
  @Get()
  async getAll() {
    return this.rolesService.findAll()
  }

  @ApiOperation({ description: 'Busqueda de un rol' })
  @ApiOkResponse({ description: 'Rol obtenido con exito', type: RoleEntity })
  @ApiNotFoundResponse({ description: 'No existe ese rol' })
  @ApiParam({
    name: 'uuid',
    required: true,
    description: 'El identificador unico',
    example: 'abcd-efgh-ijkl-opqr',
    type: String
  })
  @Get('/:uuid')
  async get(@Param('uuid') uuid: string) {
    return this.rolesService.findOneByUuid(uuid)
  }
}
