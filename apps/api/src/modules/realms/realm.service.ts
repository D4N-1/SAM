import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RealmEntity, RealmRelations } from "./entities/realm.entity";
import { Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateRealmDto } from "./dto/create-realm.dto";
import { BotService } from "../bots/bot.service";
import { GetAllRealmQueryDto } from "./dto/get-realm.dto";
import { AllResponse } from "src/common/interfaces/response.type";


@Injectable()
export class RealmService {

    constructor(
        @InjectRepository(RealmEntity)
        private readonly realmRepository: Repository<RealmEntity>,

        private readonly botService: BotService
    ) {}


    async findAll(query: GetAllRealmQueryDto): Promise<AllResponse> {
      const { include, page = 1, limit = 10 } = query;

        const relations = include ? include.split(',') : []
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.realmRepository.findAndCount({
          relations: relations.filter( rel => RealmRelations.includes(rel) ),
          skip,
          take: limit,
          order: { index: 'ASC' }
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

        name: async(name: string) => {

            const realm = await this.realmRepository.findOne({
                where: { name }
            })

            if (!realm) throw new NotFoundException( ERROR_CODE.NOT_FOUND('reino') )
                return realm
        },

        botUid: async(botUid: string) => {

            const realm = await this.realmRepository.findOne({
                where: { botUid }
            })

            if (!realm) throw new NotFoundException( ERROR_CODE.NOT_FOUND('reino') )
                return realm

        }
    }

    async create(createRealmDto: CreateRealmDto): Promise<RealmEntity> {

        const { botUid, name, ...newData } = createRealmDto;


        const realmName = await this.realmRepository.findOneBy({ name });
        if (realmName) throw new ConflictException( ERROR_CODE.CONFLICT('reino', 'Ya existe un reino con este nombre') ); 

        const newRealmData: Partial<RealmEntity> = { ...newData };

        if (botUid) {
            const realmUid = await this.realmRepository.findOneBy({ botUid });
            if (realmUid) throw new ConflictException( ERROR_CODE.CONFLICT('reino', 'Este bot ya tiene un reino creado') );

            newRealmData.bot = await this.botService.findOneBy.contactUid(botUid);
        }

        newRealmData.botUid = botUid;
        newRealmData.name = name;

        const newRealm = this.realmRepository.create(newRealmData);

        return await this.realmRepository.save(newRealm);
    }






}