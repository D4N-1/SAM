import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { enumCommand } from "src/common/enums/command.enum";
import { CommandEntity } from "src/modules/commands/entities/command.entity";
import { Repository } from "typeorm";


@Injectable()
export class CommandSeederService implements OnModuleInit {
    private readonly logger = new Logger(CommandSeederService.name)

    constructor(
        @InjectRepository(CommandEntity)
        private readonly commandRepository: Repository<CommandEntity>
    ) {}

    async onModuleInit() {
        await this.seedCommands()

        this.logger.log('Seeder spreaded')
    }

    async seedCommands() {
        const commandsToCreate = Object.values(enumCommand);

        for (const command of commandsToCreate) {
            const exits = await this.commandRepository.findOneBy({ name: command })

            if (!exits) {
                const newCommand = this.commandRepository.create({ name: command })
                await this.commandRepository.save(newCommand)
            }
        }
    }
}