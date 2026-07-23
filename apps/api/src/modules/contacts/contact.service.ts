import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { QueryDeepPartialEntity, Repository } from "typeorm";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { AllResponse } from "src/common/interfaces/response.type";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { enumCACHE_KEYS } from "src/common/enums/cache-keys.enum";

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

    findOneBy = {

        uuid: async (uuid: string, text?: string): Promise<ContactEntity> => {
            const cacheKey = enumCACHE_KEYS.CONTACT + uuid;

            const cachedContact = await this.cacheManager.get<ContactEntity>(cacheKey);
            if (cachedContact) return cachedContact;

            const contact = await this.contactRepository.findOneBy({ uuid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto', text) )

            const plainContact = Object.assign({}, contact);
            await this.cacheManager.set(cacheKey, plainContact)

            return contact
        },

        uid: async (uid: string, text?: string): Promise<ContactEntity> => {
            const cacheKey = enumCACHE_KEYS.CONTACT + uid;

            const cachedContact = await this.cacheManager.get<ContactEntity>(cacheKey);
            if (cachedContact) return cachedContact;

            const contact = await this.contactRepository.findOneBy({ uid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto', text) )

            const plainContact = Object.assign({}, contact)
            await this.cacheManager.set(cacheKey, plainContact)

            return contact
        },

        lid: async (lid: string): Promise<ContactEntity> => {

            const contact = await this.contactRepository.findOneBy({ lid })

            if (!contact) throw new NotFoundException( ERROR_CODE.NOT_FOUND('contacto') )
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


async bulk(createContactsDto: any) {
  if (!createContactsDto || (Array.isArray(createContactsDto) && createContactsDto.length === 0)) {
    throw new BadRequestException(ERROR_CODE.BAD_REQUEST('BODY', 'No se proporcionaron contactos'));
  }

  // 1. Normalizar entrada (Soporta array u objeto único de forma segura)
  const contactsArray = Array.isArray(createContactsDto) 
    ? createContactsDto 
    : [createContactsDto];

  // 2. Mapear y sanear la data
const rawEntities: QueryDeepPartialEntity<ContactEntity>[] = contactsArray
      .filter((c) => c && c.uid)
      .map((c) => ({
        uid: String(c.uid),
        lid: c.lid ? String(c.lid) : undefined, // Usar undefined en lugar de null para TypeORM
      }));

  if (rawEntities.length === 0) {
    throw new BadRequestException(ERROR_CODE.BAD_REQUEST('BODY', 'Ningún contacto válido contiene UID'));
  }

  // 3. Procesar en bloques (chunks) de 500 registros para evitar sobrecargar la memoria/packet de MySQL
  const chunkSize = 500;
  for (let i = 0; i < rawEntities.length; i += chunkSize) {
    const chunk = rawEntities.slice(i, i + chunkSize);

    await this.contactRepository
      .createQueryBuilder()
      .insert()
      .into(ContactEntity)
      .values(chunk)
      // Como ambos son UNIQUE, indicamos que si choca por 'uid', actualice 'lid'
      // Si también quieres actualizar 'uid' en caso de que choque por 'lid', agregas 'uid' al array de campos a actualizar
      .orUpdate(['lid'], ['uid']) 
      .execute();
  }

  return { 
    status: 'OK', 
    processed: rawEntities.length 
  };
}

    async create(createContactDto: CreateContactDto): Promise<ContactEntity|null> {

        const { lid, uid, ...newData } = createContactDto

        const newContactData: Partial<ContactEntity> = { ...newData }
        const contact = await this.contactRepository.findOneBy({ uid })
        if (contact) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa UID') )

        if (lid) {
            const contact = await this.contactRepository.findOneBy({ lid })

            if (contact) throw new ConflictException( ERROR_CODE.CONFLICT('contacto', 'Ya existe ese contacto con esa LID') )
            newContactData.lid = lid;
        }

        const newContact = this.contactRepository.create(newContactData)
        return this.contactRepository.save(newContact)
    }

    async update(uid: string, updateContactDto: UpdateContactDto): Promise<ContactEntity|null> {

        const contact = await this.findOneBy.uid(uid)

        if (updateContactDto.lid) {
            const exist = await this.contactRepository.findOneBy({ lid: updateContactDto.lid })

            if (exist && exist.uid !== uid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

        } else if (updateContactDto.uid) {
            const exist = await this.contactRepository.findOneBy({ uid: updateContactDto.uid })

            if (exist && exist.uid !== uid) throw new ConflictException( ERROR_CODE.CONFLICT('contacto') )

        }

        const editContact = this.contactRepository.merge(contact, updateContactDto)

        await this.cacheManager.del(enumCACHE_KEYS.CONTACT + uid)
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