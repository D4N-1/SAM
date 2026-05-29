import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RealmEntity } from "./entities/realm.entity";
import { RealmController } from "./realm.controller";
import { RealmService } from "./realm.service";
import { BotModule } from "../bots/bot.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([RealmEntity]),
        BotModule
    ],
    controllers: [ RealmController],
    providers: [ RealmService ]
})
export class RealmModule {}