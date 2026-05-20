import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { Repository } from "typeorm";

@Injectable()
export class ContactSeederService implements OnModuleInit {

    constructor(
        @InjectRepository(ContactEntity)
        private readonly contactRepository: Repository<ContactEntity>
    ) {}

    async onModuleInit() {
        await this.seedContacts()
    }

    async seedContacts() {
        const contactsToCreate = [
            { uid: '1', lid: '1', name: 'One' },
            { uid: '2', lid: '2', name: 'two' },
            { uid: '3', lid: '3', name: 'three' }
        ]

        for (const contact of contactsToCreate) {
            const exist = await this.contactRepository.findOneBy({ uid: contact.uid })
            if (!exist) {
                const newContact = this.contactRepository.create(contact)
                await this.contactRepository.save(newContact)
            }
        }

        console.log(`[] - Seeder de Contactos realizado`)
        
    }
}