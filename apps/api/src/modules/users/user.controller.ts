import { Controller, Get, Param, Body, Post, Patch, Delete, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse, ApiTags, ApiParam, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";
import { API_PARAM } from "src/common/constants/api-param";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { GetAllUserQueryDto } from "./dto/get-user.dto";
import { Private } from "src/decorators/private.decorator";
import { Roles } from "src/decorators/roles-user.decorator";
import { enumRole } from "src/common/enums/role.enum";


//@Private() @Roles([ enumRole.ADMIN ]) @ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor( private readonly userService: UserService) {}

    @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('usuarios') })
    @ApiOkResponse({ description: SWAGGER.OK.ALL('usuarios'), type: [UserEntity] })
    @Get()
    async getAll(@Query() query: GetAllUserQueryDto) {
        return this.userService.findAll(query)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('usuario') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('usuario'), type: UserEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
    @ApiParam(API_PARAM.UUID)
    @Get('/:uuid')
    async getUuid(@Param('uuid', pipeValidateUuid) uuid: string): Promise<UserEntity|null> {
        return this.userService.findOneBy.uuid(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('usuario') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('usuario'), type: UserEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
    @ApiParam(API_PARAM.UUID)
    @Get('/:name')
    async get(@Param('name') name: string): Promise<UserEntity|null> {
        return this.userService.findOneBy.name(name)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('usuario') })
    @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('usuario'), type: UserEntity })
    @ApiConflictResponse({ description: SWAGGER.CONFLICT('usuario'), schema: { example: ERROR_CODE.CONFLICT('usuario') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity|null> {
        return this.userService.create(createUserDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('usuario') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('usuario'), type: UserEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/:uuid')
    async update(@Param('uuid', pipeValidateUuid) uuid: string, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity|null> {
        return this.userService.update(uuid, updateUserDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('usuario') })
    @ApiOkResponse({ description: SWAGGER.OK.DELETE('usuario'), type: UserEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
    @ApiParam(API_PARAM.UUID)
    @Delete('/:uuid')
    async delete(@Param('uuid', pipeValidateUuid) uuid: string) {
        return this.userService.delete(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.RECOVER('usuario') })
    @ApiOkResponse({ description: SWAGGER.OK.RECOVER('usuario'), type: UserEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
    @ApiConflictResponse({ description: SWAGGER.CONFLICT('usuario'), schema: { example: ERROR_CODE.CONFLICT('usuario') }} )
    @Patch('/recover/:uuid')
    async recover(@Param('uuid', pipeValidateUuid) uuid: string): Promise<UserEntity|null> {
        return this.userService.recover(uuid)
    }

}