import { Module } from "@nestjs/common";
import { BotSocketGateway } from "./gateway/bot-socket.gateway";
import { AuthModule } from "../auth/auth.module";
import { BotSocketService } from "./bot-socket.service";



@Module({
    imports: [
        AuthModule
    ],
    controllers: [],
    providers: [BotSocketGateway, BotSocketService],
    exports: []
})
export class BotSocketModule {}