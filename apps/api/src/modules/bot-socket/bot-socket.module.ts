import { Module, forwardRef } from "@nestjs/common";
import { BotSocketGateway } from "./gateway/bot-socket.gateway";
import { AuthModule } from "../auth/auth.module";
import { BotSocketService } from "./bot-socket.service";



@Module({
    imports: [
        forwardRef( () => AuthModule )
    ],
    controllers: [],
    providers: [BotSocketGateway, BotSocketService],
    exports: [ BotSocketService ]
})
export class BotSocketModule {}