import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { Repository } from "typeorm";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ERROR_CODE } from "src/common/messages/error.message";
import { UpdateContactDto } from "./dto/update-contact.dto";

@Injectable()
export class ContactService {

    constructor(
        @InjectRepository(ContactEntity)
        private readonly ContactRepository: Repository<ContactEntity>
    ) {}


    findAll() {
        return this.ContactRepository.find()
    }

    async findOneByUuid(uuid: string): Promise<ContactEntity|null> {
        const contact = await this.ContactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )
        return contact
    }

    async create(createContactDto: CreateContactDto): Promise<ContactEntity|null> {

        if ( await this.ContactRepository.findOneBy({ uid: createContactDto.uid }) ) throw new ConflictException()
        if ( createContactDto.lid && await this.ContactRepository.findOneBy({ lid: createContactDto.lid }) ) throw new ConflictException()

        const newContact = this.ContactRepository.create(createContactDto)
        return this.ContactRepository.save(newContact)
    }

    async update(uuid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {

        const contact = await this.ContactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        if (updateContactDto.lid) {
            const exist = await this.ContactRepository.findOneBy({ lid: updateContactDto.lid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT() )

        } else if (updateContactDto.uid) {
            const exist = await this.ContactRepository.findOneBy({ uid: updateContactDto.uid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT() )

        }

        const editContact = this.ContactRepository.merge(contact, updateContactDto)

        return await this.ContactRepository.save(editContact)
    }

    async recover(uuid: string) {

        const contact = await this.ContactRepository.findOne({
            where: { uuid },
            withDeleted: true
        })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        if (!contact.deletedAt) throw new BadRequestException( ERROR_CODE.BAD_REQUEST() )

        return await this.ContactRepository.recover(contact)
    }

    async delete(uuid: string) {

        const contact = await this.ContactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        return {
            message: 'Contacto ELIMINADO',
            contact: await this.ContactRepository.softRemove(contact)
        }
    }
}