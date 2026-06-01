import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RealmEntity } from "./entities/realm.entity";
import { RealmController } from "./realm.controller";
import { RealmService } from "./realm.service";
import { BotModule } from "../bots/bot.module";
import { RealmCommandEntity } from "./entities/uni-realm-command.entity";
import { CommandModule } from "../commands/commands.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([RealmEntity, RealmCommandEntity]),
        BotModule, CommandModule
    ],
    controllers: [ RealmController],
    providers: [
        RealmService,
    ],
    exports: [ RealmService ]
})
export class RealmModule {}