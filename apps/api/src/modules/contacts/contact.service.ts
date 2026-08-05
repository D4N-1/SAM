import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { Not, QueryDeepPartialEntity, Repository } from "typeorm";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { AllResponse } from "src/common/interfaces/response.type";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { enumCACHE_KEYS } from "src/common/enums/cache-keys.enum";
import { plainToInstance } from "class-transformer";
import { enumContactId } from "src/common/enums/contact-ids.enum";

@Injectable()
export class ContactService {

    constructor(
        @InjectRepository(ContactEntity)
        private readonly contactRepository: Repository<ContactEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}


    async findAll(query): Promise<AllResponse> {
        const page = Math.max(1, parseInt( query?.page, 10) || 1);
        const limit = Math.max(1, parseInt( query?.limit, 10) || 10);
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.contactRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'ASC' }
        })

        return {
            data,
            meta: {
                totalItems: total,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        }
    }

    
    cache = {

        key: enumCACHE_KEYS.CONTACT,

        set: (id: string, contact: Record<string,any>) => {
            this.cacheManager.set( this.cache.key + id, contact )
        },

        get: async(id: string): Promise<ContactEntity|undefined> => {
            return await this.cacheManager.get<ContactEntity>( this.cache.key + id )
        },

        del: (id: string) => {
            this.cacheManager.del( this.cache.key + id )
        }

    }

    findOneBy = {

        uuid: async (uuid: string, text?: string): Promise<ContactEntity> => {

            const cachedContact = await this.cache.get(uuid);
            if (cachedContact) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ uuid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto', text) )

            this.cache.set(uuid, contact);

            return contact
        },

        uid: async (uid: string, noCache?: boolean): Promise<ContactEntity> => {

            if ( uid?.endsWith( enumContactId.LID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('QUERY', 'El UID del contacto NO puede terminar en "@lid"' ) );
                else if ( !uid.includes('@') ) uid = uid + enumContactId.UID

            if ( !uid.endsWith( enumContactId.UID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'El UID del contacto DEBE ser solo númerico' ) );

            const cachedContact = await this.cache.get(uid);
            if (cachedContact && !noCache) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ uid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') )

            this.cache.set(uid, contact)

            return contact
        },

        lid: async (lid: string, noCache?: boolean): Promise<ContactEntity> => {

            if ( lid?.endsWith( enumContactId.UID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('QUERY', 'El LID del contacto NO puede terminar en "@s.whatsapp.net"' ) );
                else if ( !lid.includes('@') ) lid = lid + enumContactId.LID

            if ( !lid.endsWith( enumContactId.LID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'El LID del contacto DEBE ser solo númerico' ) );

            const cachedContact = await this.cache.get(lid);
            if (cachedContact && !noCache) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ lid })
            
            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') );

            this.cache.set(lid, contact);

            return contact;
        },

        username: async (username: string, noCache?: boolean): Promise<ContactEntity> => {

            const cachedContact = await this.cache.get(username);
            if (cachedContact && !noCache) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ username })
            
            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') );

            this.cache.set(username, contact);

            return contact;
        }
    }


    findOrNull = {

        uuid: async (uuid: string): Promise<ContactEntity|null> => {

            const cachedContact = await this.cache.get(uuid);
            if (cachedContact) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ uuid })

            if (contact) this.cache.set(uuid, contact)

            return contact
        },

        uid: async (uid: string): Promise<ContactEntity|null> => {

            if ( uid?.endsWith( enumContactId.LID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('QUERY', 'El UID del contacto NO puede terminar en "@lid"' ) );
                else if ( !uid.includes('@') ) uid = uid + enumContactId.UID

            if ( !uid.endsWith( enumContactId.UID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'El UID del contacto DEBE ser solo númerico' ) );

            const cachedContact = await this.cache.get(uid);
            if (cachedContact) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ uid })

            if (contact) this.cache.set(uid, contact)

            return contact
        },

        lid: async (lid: string): Promise<ContactEntity|null> => {

            if ( lid?.endsWith( enumContactId.UID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('QUERY', 'El LID del contacto NO puede terminar en "@s.whatsapp.net"' ) );
                else if ( !lid.includes('@') ) lid = lid + enumContactId.LID

            if ( !lid.endsWith( enumContactId.LID ) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'El LID del contacto DEBE ser solo númerico' ) );

            const cachedContact = await this.cache.get(lid);
            if (cachedContact) return plainToInstance(ContactEntity, cachedContact);

            const contact = await this.contactRepository.findOneBy({ lid })
            
            if (contact) this.cache.set(lid, contact);

            return contact;
        }
    }

    async findIn(uids: string[]) {
        
        if (!uids || uids.length === 0) return [];

        const contacts = await this.contactRepository.createQueryBuilder('contact')
            .where('contact.uid IN (:...uids)', { uids })
            .getMany()

        return contacts
    }


    async bulk(Dto) {

        const createContactsDto = Array.isArray(Dto) ? Dto : Dto.contacts
        if (!createContactsDto || createContactsDto.length === 0) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'No se proporcionaron contactos') );
    

        const rawEntities: QueryDeepPartialEntity<ContactEntity>[] = createContactsDto
            .filter( (c) => Boolean(c.phoneNumber) )
            .map((c) => ({
                uid: String(c.phoneNumber),
                lid: c.id ? String(c.id) : undefined,
            }));

        if (rawEntities.length === 0) throw new BadRequestException(ERROR_CODE.BAD_REQUEST('BODY', 'Ningún contacto válido contiene UID') );


        await this.contactRepository
          .createQueryBuilder()
          .insert()
          .into('contacts')
          .values(rawEntities)
          .orIgnore() 
          .execute();


        return { 
          status: 'OK', 
          processed: rawEntities.length 
        };
    }

    async create(createContactDto: CreateContactDto): Promise<ContactEntity|null> {

        const { lid, uid, ...newData } = createContactDto

        const newContactData: Partial<ContactEntity> = { ...newData }

        const [ contactUid, contactLid ] = await Promise.all([
            uid ? await this.findOrNull.uid(uid) : null,
            lid ? await this.findOrNull.lid(lid) : null
        ])

        if (contactUid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa UID') );
        if (contactLid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa LID') );

        newContactData.uid = uid
        newContactData.lid = lid

        if (!uid && !lid) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('BODY', 'El contacto debe tener UID o LID') )

        const newContact = this.contactRepository.create(newContactData)
        return this.contactRepository.save(newContact)
    }

    update = {

        uid: async(uid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> => {

            const contact = await this.findOneBy.uid(uid, true)

            if (updateContactDto.lid) {
                const exist = await this.contactRepository.findOne({
                    where: { lid: updateContactDto.lid, index: Not(contact.index) }
                })

                if (exist) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

                updateContactDto.lid = updateContactDto.lid

            }

            const editContact = this.contactRepository.merge(contact, updateContactDto)

            this.cache.del(uid)
            return await this.contactRepository.save(editContact)
        },

        lid: async(lid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> => {

            const contact = await this.findOneBy.lid(lid, true)

            if (updateContactDto.uid) {
                const exist = await this.contactRepository.findOne({
                    where: { uid: updateContactDto.uid, index: Not(contact.index) }
                })
            
                if (exist) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

                updateContactDto.uid = updateContactDto.uid

            }

            const editContact = this.contactRepository.merge(contact, updateContactDto)

            this.cache.del(lid)
            return await this.contactRepository.save(editContact)
        }
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