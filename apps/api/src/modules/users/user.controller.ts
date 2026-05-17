import { Controller, Get, Param, Body, Post, Patch, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";
import { API_PARAM } from "src/common/constants/api-param";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor( private readonly userService: UserService) {}

    @ApiOperation({ description: 'Obtiene todos los usuarios' })
    @ApiOkResponse({ description: 'Lista los usuarios existentes', type: [UserEntity] })
    @ApiNotFoundResponse({ description: 'No existen perfiles creados', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @Get()
    async getAll(): Promise<UserEntity[]|null> {
        return this.userService.findAll()
    }

    @ApiOperation({ description: 'Obtiene un usuario' })
    @ApiOkResponse({ description: 'Usuario obtenido con exito', type: UserEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentarlo', schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: 'No existe ese usuario', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Get('/:uuid')
    async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<UserEntity|null> {
        return this.userService.findByUuid(uuid)
    }

    @ApiOperation({ description: 'Crea un nuevo usuario' })
    @ApiCreatedResponse({ description: 'Usuario creado con exito', type: UserEntity })
    @ApiConflictResponse({ description: 'Ya existe ese usuario', schema: { example: ERROR_CODE.CONFLICT() } })
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity|null> {
        return this.userService.create(createUserDto)
    }

    @ApiOperation({ description: 'Actualiza un usuario' })
    @ApiOkResponse({ description: 'Usuario actualizado con exito', type: UserEntity })
    @ApiNotFoundResponse({ description: 'No existe ese usuario', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/:uuid')
    async update(@Param('uuid', pipeValidateUuid) uuid: string, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity|null> {
        return this.userService.update(uuid, updateUserDto)
    }

    @ApiOperation({ description: 'Elimina un usuario' })
    @ApiOkResponse({ description: 'Usuario eliminado con exito', type: UserEntity })
    @ApiNotFoundResponse({ description: 'No existe ese usuario', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Delete('/:uuid')
    async delete(@Param('uuid', pipeValidateUuid) uuid: string) {
        return this.userService.delete(uuid)
    }

}