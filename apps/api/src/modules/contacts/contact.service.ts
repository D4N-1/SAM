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
        private readonly contactRepository: Repository<ContactEntity>
    ) {}


    findAll() {
        return this.contactRepository.find()
    }

    async findOneByUuid(uuid: string): Promise<ContactEntity|null> {
        const contact = await this.contactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )
        return contact
    }

    async create(createContactDto: CreateContactDto): Promise<ContactEntity|null> {

        if ( await this.contactRepository.findOneBy({ uid: createContactDto.uid }) ) throw new ConflictException( ERROR_CODE.CONFLICT() )
        if ( createContactDto.lid && await this.contactRepository.findOneBy({ lid: createContactDto.lid }) ) throw new ConflictException( ERROR_CODE.CONFLICT() )

        const newContact = this.contactRepository.create(createContactDto)
        return this.contactRepository.save(newContact)
    }

    async update(uuid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {

        const contact = await this.contactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        if (updateContactDto.lid) {
            const exist = await this.contactRepository.findOneBy({ lid: updateContactDto.lid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT() )

        } else if (updateContactDto.uid) {
            const exist = await this.contactRepository.findOneBy({ uid: updateContactDto.uid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT() )

        }

        const editContact = this.contactRepository.merge(contact, updateContactDto)

        return await this.contactRepository.save(editContact)
    }

    async recover(uuid: string) {

        const contact = await this.contactRepository.findOne({
            where: { uuid },
            withDeleted: true
        })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        if (!contact.deletedAt) throw new BadRequestException( ERROR_CODE.BAD_REQUEST() )

        return await this.contactRepository.recover(contact)
    }

    async delete(uuid: string) {

        const contact = await this.contactRepository.findOneBy({ uuid })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

        return {
            message: 'Contacto ELIMINADO',
            contact: await this.contactRepository.softRemove(contact)
        }
    }
}