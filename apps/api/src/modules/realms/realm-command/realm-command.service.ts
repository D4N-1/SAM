import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RealmCommandEntity, RealmCommandRelations } from "../entities/realm-command.entity";
import { Not, Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { CreateRealmCommandDto } from "../dto/create-realm-command.dto";
import { AllResponse } from "src/common/interfaces/response.type";
import { UpdateRealmCommandDto } from "../dto/update-realm-command.dto";
import { CommandService } from "src/modules/commands/commands.service";
import { RealmService } from "../realm.service";
import { RealmEntity } from "../entities/realm.entity";


@Injectable()
export class RealmCommandService {

    constructor(
        @InjectRepository(RealmCommandEntity)
        private readonly realmCommandRepository: Repository<RealmCommandEntity>,

        private readonly commandService: CommandService,
        private readonly realmService: RealmService

    ) {}


    async findAll(realm: RealmEntity, query): Promise<AllResponse> {
      const { include, page = 1, limit = 10 } = query;

        const relations = include ? include.split(',') : []
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.realmCommandRepository.findAndCount({
            where: { realm: { name: realm.name } },
            relations: relations.filter( rel => RealmCommandRelations.includes(rel) ),
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

        realmCommand: async(realmName: string, commandName: string) => {

            const realm = await this.realmCommandRepository.findOne({
                where: {
                    realm: { name: realmName },
                    command: { name: commandName }
                }
            })

            if (!realm) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comando del reino') )
                return realm
        }
    }

    async create(realmName: string, createRealmCommandDto: CreateRealmCommandDto): Promise<RealmCommandEntity> {

        const { commandName, ...newData } = createRealmCommandDto;

        const command = await this.commandService.findOneBy.name(commandName);
        const realm = await this.realmService.findOneBy.name(realmName);

        const newRealmData: Partial<RealmCommandEntity> = { ...newData };

        newRealmData.command = command;
        newRealmData.realm = realm;

        const newRealm = this.realmCommandRepository.create(newRealmData);

        return await this.realmCommandRepository.save(newRealm);
    }


    async update(realm: RealmEntity, commandName: string, updateRealmCommandDto: UpdateRealmCommandDto) {

        const { active } = updateRealmCommandDto;

        const realmCommand = await this.findOneBy.realmCommand(realm.name, commandName)

        const updateRealmCommandData: Partial<RealmCommandEntity> = { active };

        const updatedRealm = this.realmCommandRepository.merge(realmCommand, updateRealmCommandData)

        return await this.realmCommandRepository.save(updatedRealm)
    }






}