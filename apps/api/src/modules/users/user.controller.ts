import { Controller, Get, Param, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse, ApiTags } from "@nestjs/swagger";
import { ERROR_CODE } from "src/common/messages/error.message";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor( private readonly userService: UserService) {}

    @ApiOperation({ description: 'Obtiene todos los usuarios' })
    @ApiOkResponse({ description: 'Lista los usuarios existentes', type: [UserEntity] })
    @ApiNotFoundResponse({ description: 'No existen perfiles creados', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @Get()
    async getAll(): Promise<UserEntity[]|null> {
        return this.userService.getAll()
    }

    @ApiOperation({ description: 'Obtiene un usuario' })
    @ApiOkResponse({ description: 'Usuario obtenido con exito', type: UserEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentarlo', schema: { example: ERROR_CODE.BAD_REQUEST() } })
    @ApiNotFoundResponse({ description: 'No existe ese usuario', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @Get('/:uuid')
    async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<UserEntity|null> {
        return this.userService.getByUuid(uuid)
    }

    @ApiOperation({ description: 'Crea un nuevo usuario' })
    @ApiCreatedResponse({ description: 'Usuario creado con exito', type: UserEntity })
    @ApiConflictResponse({ description: 'Ya existe ese usuario', schema: { example: ERROR_CODE.CONFLICT() } })
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity|null> {
        return this.userService.create(createUserDto)
    }
}