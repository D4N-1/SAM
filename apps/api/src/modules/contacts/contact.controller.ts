import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ContactEntity } from "./entities/contact.entity";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { API_PARAM } from "src/common/constants/api-param";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { Private } from "src/decorators/private.decorator";

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {

    constructor(private readonly contactService: ContactService) {}

    @ApiOperation({ summary: SWAGGER.SUMMARY.ALL('contactos') })
    @ApiOkResponse({ description: SWAGGER.OK.ALL('contactos'), type: [ContactEntity] })
    @Get() @Private() @ApiBearerAuth()
    async getAll(@Query() query: GetAllQueryDto) {
        return this.contactService.findAll(query)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('contacto') })
    @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('contacto'), type: ContactEntity })
    @ApiConflictResponse({ description: SWAGGER.CONFLICT('contacto'), schema: { example: ERROR_CODE.CONFLICT('usuario') } })
    @Post()
    async create(@Body() createContactDto: CreateContactDto): Promise<ContactEntity|null> {
        return this.contactService.create(createContactDto)
    }

    @ApiOperation({ summary: 'Crea desde un array de contactos' })
    @ApiCreatedResponse({ description: 'Todos los contactos han sido creados', type: ContactEntity })
    @Post('/bulk') @Private() @ApiBearerAuth()
    async createBulk(@Body() createContactDto: CreateContactDto[]) {
        return this.contactService.bulk(createContactDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('contacto'), type: ContactEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UUID)
    @Get('/uuid/:uuid')
    async getUuid(@Param('uuid', pipeValidateUuid) uuid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneBy.uuid(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('contacto'), type: ContactEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto') , schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UID)
    @Get('/uid/:uid')
    async getUid(@Param('uid') uid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneBy.uid(uid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('contacto'), type: ContactEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto') , schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UID)
    @Get('/lid/:lid')
    async getLid(@Param('lid') lid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneBy.lid(lid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.EDIT('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.EDIT('contacto'), type: ContactEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UID)
    @Patch('/:uid') @Private() @ApiBearerAuth()
    async edit(@Param('uid') uid: string, @Body() updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {
        return this.contactService.update(uid, updateContactDto)
    }
    
    @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.DELETE('contacto'), type: ContactEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UUID)
    @Delete('/:uid') @Private() @ApiBearerAuth()
    async delete(@Param('uid') uuid: string) {
        return this.contactService.delete(uuid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.RECOVER('contacto') })
    @ApiOkResponse({ description: SWAGGER.OK.RECOVER('contacto'), type: ContactEntity })
    @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('contacto'), schema: { example: ERROR_CODE.NOT_FOUND('contacto') } })
    @ApiParam(API_PARAM.UUID)
    @Patch('/recover/:uuid') @Private() @ApiBearerAuth()
    async recover(@Param('uuid') uuid: string): Promise<ContactEntity|null> {
        return this.contactService.recover(uuid)
    }

}