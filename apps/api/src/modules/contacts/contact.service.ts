import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { Repository } from "typeorm";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ERROR_CODE } from "src/common/utils/error.utils";
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

    findOneBy = {

        uuid: async (uuid: string): Promise<ContactEntity> => {
            const contact = await this.contactRepository.findOneBy({ uuid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') )
            return contact
        },

        uid: async (uid: string): Promise<ContactEntity> => {
            const contact = await this.contactRepository.findOneBy({ uid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') )
            return contact
        }
    }


    async create(createContactDto: CreateContactDto): Promise<ContactEntity|null> {

        const { lid, ...newData } = createContactDto

        const newContactData: Partial<ContactEntity> = { ...newData }
        const contact = await this.contactRepository.findOneBy({ uid: newData.uid })
        if (contact) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa UID') )

        if (lid) {
            const contact = await this.contactRepository.findOneBy({ lid })

            if (contact) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa LID') )
            newContactData.lid = lid;
        }

        const newContact = this.contactRepository.create(newContactData)
        return this.contactRepository.save(newContact)
    }

    async update(uuid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {

        const contact = await this.findOneBy.uuid(uuid)

        if (updateContactDto.lid) {
            const exist = await this.contactRepository.findOneBy({ lid: updateContactDto.lid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

        } else if (updateContactDto.uid) {
            const exist = await this.contactRepository.findOneBy({ uid: updateContactDto.uid })

            if (exist && exist.uuid !== uuid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

        }

        const editContact = this.contactRepository.merge(contact, updateContactDto)

        return await this.contactRepository.save(editContact)
    }


    async delete(uuid: string) {

        const contact = await this.findOneBy.uuid(uuid)

        return {
            message: 'Contacto ELIMINADO',
            contact: await this.contactRepository.softRemove(contact)
        }
    }

    async recover(uuid: string) {

        const contact = await this.contactRepository.findOne({
            where: { uuid },
            withDeleted: true
        })

        if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') )

        if (!contact.deletedAt) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'El contacto no ha sido eliminado aún') )

        return await this.contactRepository.recover(contact)
    }
}