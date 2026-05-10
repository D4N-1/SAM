import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ContactEntity } from "./entities/contact.entity";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";


@Controller('contacts')
export class ContactController {

    constructor(private readonly contactService: ContactService) {}

    @Get()
    async getAll(): Promise<ContactEntity[]> {
        return this.contactService.findAll()
    }

    @Get('/:uuid')
    async get(@Param('uuid') uuid: string): Promise<ContactEntity|null> {
        return this.contactService.findOneByUuid(uuid)
    }

    @Post()
    async create(@Body() createContactDto: CreateContactDto): Promise<ContactEntity|null> {
        return this.contactService.create(createContactDto)
    }

    @Put('/:uuid')
    async edit(@Param('uuid') uuid: string, @Body() updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {
        return this.contactService.update(uuid, updateContactDto)
    }

    @Delete('/:uuid')
    async delete(@Param('uuid') uuid: string) {
        return this.contactService.delete(uuid)
    }
}