import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { ContactService } from '../contacts/contact.service';
import { hash } from 'bcrypt';


@Injectable()
export class BotsService {
  
  constructor(
    @InjectRepository(BotEntity)
    private readonly botRepository: Repository<BotEntity>,

    private readonly contactService: ContactService
  ) {}


  async findAll(): Promise<BotEntity[]> {
    return this.botRepository.find()
  }

  async create(createBotDto: CreateBotDto) {

    const { ownerContactUid, token, contactUid, ...newData } = createBotDto;

    const newBotData: Partial<BotEntity> = { ...newData }
    
    newBotData.contact = await this.contactService.findOneBy.uid(createBotDto.contactUid)

    if (ownerContactUid) {
      const exist = await this.contactService.findOneBy.uid(ownerContactUid)

      const isOwner = await this.botRepository.findOne({
        where: { ownerContact: { index: exist.index } }
      })
      if (!isOwner) throw new ConflictException( ERROR_CODE.CONFLICT('bot', 'Este contacto ya es dueño de otro bot') )

      newBotData.ownerContact = exist;
    }

    newBotData.tokenHash = await hash(token, 10)

    const newBot = this.botRepository.create(newBotData)

    return this.botRepository.save(newBot)
  }

}
