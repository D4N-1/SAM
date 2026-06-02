import { Module } from "@nestjs/common";
import { GroupCommandService } from "./group-command.service";
import { GroupCommandController } from "./group-command.controller";
import { GroupModule } from "../groups/group.module";
import { CommandModule } from "../commands/commands.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupCommandEntity } from "./entities/group-command.entity";



@Module({
    imports: [
        TypeOrmModule.forFeature([ GroupCommandEntity ]),
        GroupModule, CommandModule
    ],
    controllers: [ GroupCommandController ],
    providers: [ GroupCommandService ],
    exports: [ GroupCommandService ]
})
export class GroupCommandModule {}