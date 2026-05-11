import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ContactEntity } from "./entities/contact.entity";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { ERROR_CODE } from "src/common/messages/error.message";
import { API_PARAM } from "src/common/constants/api-param";


@Controller('contacts')
export class ContactController {

    constructor(private readonly contactService: ContactService) {}

    @ApiOperation({ description: 'Lista todos los contactos' })
    @ApiOkResponse({ description: 'Lista los contactos existentes', type: [ContactEntity] })
    @ApiNotFoundResponse({ description: 'No existen contactos creados', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @Get()
    async getAll(): Promise<ContactEntity[]> {
        return this.contactService.findAll()
    }

    @ApiOperation({ description: 'Crea un nuevo contacto' })
    @ApiCreatedResponse({ description: 'Contacto creado con exito', type: ContactEntity })
    @ApiConflictResponse({ description: 'Ya existe ese contacto', schema: { example: ERROR_CODE.CONFLICT() } })
    @Post()
    async create(@Body() createContactDto: CreateContactDto): Promise<ContactEntity|null> {
        return this.contactService.create(createContactDto)
    }

    @ApiOperation({ description: 'Obtiene un contacto' })
    @ApiOkResponse({ description: 'Contacto obtenido con exito', type: ContactEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentar', schema: { example: ERROR_CODE.BAD_REQUEST() } })
    @ApiNotFoundResponse({ description: 'No existe ese contacto', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Get('/:uuid')
    async get(@Param('uuid', pipeValidateUuid) uuid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneByUuid(uuid)
    }

    @ApiOperation({ description: 'Edita un contacto' })
    @ApiOkResponse({ description: 'Contacto editado con exito', type: ContactEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentar', schema: { example: ERROR_CODE.BAD_REQUEST() } })
    @ApiNotFoundResponse({ description: 'No existen ese contacto', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/:uuid')
    async edit(@Param('uuid', pipeValidateUuid) uuid: string, @Body() updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {
        return this.contactService.update(uuid, updateContactDto)
    }

    @ApiOperation({ description: 'Elimina un contacto' })
    @ApiOkResponse({ description: 'Contacto eliminado con exito', type: ContactEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentar', schema: { example: ERROR_CODE.BAD_REQUEST() } })
    @ApiNotFoundResponse({ description: 'No existe ese contacto', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Delete('/:uuid')
    async delete(@Param('uuid', pipeValidateUuid) uuid: string) {
        return this.contactService.delete(uuid)
    }

    @ApiOperation({ description: 'Recupera un contacto eliminado' })
    @ApiOkResponse({ description: 'Contacto recuperado con exito', type: ContactEntity })
    @ApiBadRequestResponse({ description: 'UUID mal formado, revisa y vuelve a intentar', schema: { example: ERROR_CODE.BAD_REQUEST() } })
    @ApiNotFoundResponse({ description: 'No existe ese contacto', schema: { example: ERROR_CODE.NOT_FOUND() } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/recover/:uuid')
    async recover(@Param('uuid', pipeValidateUuid) uuid: string): Promise<ContactEntity|null> {
        return this.contactService.recover(uuid)
    }

}