import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BotEntity, enumBotRole } from './entities/bot.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { ContactService } from '../contacts/contact.service';
import { hash } from 'bcrypt';
import { UpdateBotDto } from './dto/update-bot.dto';
import { GetAllBotQueryDto } from './dto/get-bot.dto';
import { AllResponse } from 'src/common/interfaces/response.type';
import { BotAuthEntity } from './entities/bot-auth.entity';


@Injectable()
export class BotService {
  
  constructor(
    @InjectRepository(BotEntity)
    private readonly botRepository: Repository<BotEntity>,

    private readonly contactService: ContactService
  ) {}


    async findAll(query: GetAllBotQueryDto): Promise<AllResponse> {
        const { include, page = 1, limit = 10 } = query

        const relations = include ? include.split(',') : [];
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.botRepository.findAndCount({
            relations: relations.filter( rel => [ 'contact', 'ownerContact' ].includes(rel) ),
            skip,
            take: limit,
            order: { index: 'ASC' }
        });


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

      uuid: async(uuid: string): Promise<BotEntity> => {

        const bot = await this.botRepository.findOne({
          where: { uuid },
          relations: { contact: true, ownerContact: true }
        })

        if (!bot) throw new NotFoundException( ERROR_CODE.NOT_FOUND('bot') )
          return bot
      },

      contactUid: async(uid: string): Promise<BotEntity> => {

        const bot = await this.botRepository.findOne({
          where: { contactUid: uid  },
          relations: { contact: true, ownerContact: true }
        })

        if (!bot) throw new NotFoundException( ERROR_CODE.NOT_FOUND('bot') )
          return bot
      }
    };

    findOrNull = {
    
      uuid: async(uuid: string): Promise<BotEntity|null> => {
      
        return await this.botRepository.findOne({
          where: { uuid },
          relations: { contact: true, ownerContact: true }
        })
      
      }
    
    }


  async create(createBotDto: CreateBotDto) {

    const { ownerContactUid, contactUid, code, role } = createBotDto;

    const bot = await this.botRepository.findOne({
      where: { contactUid }
    })
    if (bot) throw new ConflictException( ERROR_CODE.CONFLICT('bot', 'Ya existe un bot con ese contacto') )

    const newBotData: Partial<BotEntity> = {}
    
    newBotData.contact = await this.contactService.findOneBy.uid( contactUid );
    newBotData.codeHash = await hash(code, 10)
    newBotData.role = enumBotRole[role] || 'BEEBOT'

    if (ownerContactUid) {
      const contact = await this.contactService.findOneBy.uid( ownerContactUid, 'No se encontró ese contacto del dueño' )

      const isOwner = await this.botRepository.findOne({
        where: { ownerContact: { index: contact.index } }
      })
      if (!isOwner) throw new ConflictException( ERROR_CODE.CONFLICT('bot', 'Este contacto ya es dueño de otro bot') )

      newBotData.ownerContact = contact;
    }


    const newBot = this.botRepository.create(newBotData)

    return this.botRepository.save(newBot)
  }


  async update(uuid: string, updateBotDto: UpdateBotDto) {
    const bot = await this.findOneBy.uuid(uuid)

    const { ownerContactUid, code, contactUid } = updateBotDto;
    const editBotData: Partial<BotEntity> = {}

    if (ownerContactUid) {
      const contact = await this.contactService.findOneBy.uid( ownerContactUid, 'No se encontro ese contacto del dueño' )

      const isOwner = await this.botRepository.findOne({
        where: { ownerContact: { index: contact.index } }
      })
      if (isOwner) throw new ConflictException( ERROR_CODE.CONFLICT('bot', 'Este contacto ya es dueño de otro bot') );

      editBotData.ownerContact = contact;
    }

    if (contactUid) editBotData.contact = await this.contactService.findOneBy.uid(contactUid)

    if (code) editBotData.codeHash = await hash(code, 10);

    const editBot = this.botRepository.merge(bot, editBotData)

    return await this.botRepository.save(editBot)
  }

}
