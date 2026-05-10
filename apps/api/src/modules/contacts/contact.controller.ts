import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from "@nestjs/common";
import { ContactEntity } from "./entities/contact.entity";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { pipeValidateUuid } from "src/pipes/uuid.pipe";


@Controller('contacts')
export class ContactController {

    constructor(private readonly contactService: ContactService) {}

    @Patch('/recover/:uuid')
    async recover(@Param('uuid') uuid: string): Promise<ContactEntity|null> {
        return this.contactService.recover(uuid)
    }


    @Get()
    async getAll(): Promise<ContactEntity[]> {
        return this.contactService.findAll()
    }


    @Post()
    async create(@Body() createContactDto: CreateContactDto): Promise<ContactEntity|null> {
        return this.contactService.create(createContactDto)
    }

    @Get('/:uuid')
    async get(@Param('uuid', new pipeValidateUuid()) uuid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneByUuid(uuid)
    }

    @Patch('/:uuid')
    async edit(@Param('uuid') uuid: string, @Body() updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {
        return this.contactService.update(uuid, updateContactDto)
    }

    @Delete('/:uuid')
    async delete(@Param('uuid') uuid: string) {
        return this.contactService.delete(uuid)
    }

    @Get('*path')
    async handleUnknown() {
      throw new NotFoundException('Esta ruta dentro de /contacts no existe');
    }
}