import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { AllResponse } from "src/common/interfaces/response.type";
import { CommandService } from "src/modules/commands/commands.service";
import { GroupCommandEntity, groupCommandRelations } from "./entities/group-command.entity";
import { GroupService } from "../groups/group.service";
import { GroupEntity } from "../groups/entities/group.entity";
import { CreateGroupCommandDto } from "./dto/create-group-command.dto";
import { UpdateGroupCommandDto } from "./dto/update-group-command.dto";


@Injectable()
export class GroupCommandService {

    constructor(
        @InjectRepository(GroupCommandEntity)
        private readonly groupCommandRepository: Repository<GroupCommandEntity>,

        private readonly commandService: CommandService,
        private readonly groupService: GroupService

    ) {}


    async findAll(group: GroupEntity, query): Promise<AllResponse> {
      const { include, page = 1, limit = 10 } = query;

        const relations = include ? include.split(',') : []
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.groupCommandRepository.findAndCount({
            where: { group: { name: group.name } },
            relations: relations.filter( rel => groupCommandRelations.includes(rel) ),
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

        groupCommand: async(group: string, command: string) => {

            const groupCommand = await this.groupCommandRepository.findOne({
                where: {
                    group: { uid: group },
                    command: { name: command }
                }
            })

            if (!groupCommand) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comando del grupo') )
                return groupCommand
        }
    }

    async create(groupUid: string, createGroupCommandDto: CreateGroupCommandDto): Promise<GroupCommandEntity> {

        const { commandName, ...newData } = createGroupCommandDto;

        const groupCommand = await this.groupCommandRepository.findOne({
            where: {
                group: { uid: groupUid },
                command: { name: commandName }
            }
        })
        if (groupCommand) throw new ConflictException( ERROR_CODE.CONFLICT('comando del grupo', 'Ya existe este comando para este grupo, puedes editarlo, mas no re crearlo') )

        const command = await this.commandService.findOneBy.name(commandName);
        const group = await this.groupService.findOneBy.uid(groupUid);
        
        if (!group.realm && !group?.community?.realm) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('El grupo no esta registrado en ningun reino para modificar comandos') )

        const newRealmData: Partial<GroupCommandEntity> = { ...newData };

        newRealmData.command = command;
        newRealmData.group = group;

        const newRealm = this.groupCommandRepository.create(newRealmData);

        return await this.groupCommandRepository.save(newRealm);
    }


    async update(group: GroupEntity, commandName: string, updateGroupCommandDto: UpdateGroupCommandDto) {

        if (!group.realm && !group?.community?.realm) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('El grupo no esta registrado en ningun reino para modificar comandos') )
            
        const { active } = updateGroupCommandDto;

        const groupCommand = await this.findOneBy.groupCommand(group.name, commandName)

        const updateRealmCommandData: Partial<GroupCommandEntity> = { active };

        const updatedRealm = this.groupCommandRepository.merge(groupCommand, updateRealmCommandData)

        return await this.groupCommandRepository.save(updatedRealm)
    }

}