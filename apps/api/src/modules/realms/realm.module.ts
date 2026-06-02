import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RealmEntity } from "./entities/realm.entity";
import { RealmController } from "./realm.controller";
import { RealmService } from "./realm.service";
import { BotModule } from "../bots/bot.module";
import { RealmCommandEntity } from "./entities/realm-command.entity";
import { CommandModule } from "../commands/commands.module";
import { RealmCommandController } from "./realm-command/realm-command.controller";
import { RealmCommandService } from "./realm-command/realm-command.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([RealmEntity, RealmCommandEntity]),
        BotModule, CommandModule
    ],
    controllers: [ RealmController, RealmCommandController ],
    providers: [
        RealmService, RealmCommandService
    ],
    exports: [ RealmService ]
})
export class RealmModule {}