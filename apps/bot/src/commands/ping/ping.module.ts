import { ERROR_LOG } from "../../common/utils/error-log.util.js";
import { wait } from "../../common/utils/function.util.js";
import type { WhatsappService } from "../../estructure/whatsapp.service.js";
import type { interMessage } from "../../messages/msg.types.js";
import type { interCommand } from "../command.interface.js";
import { enumPingStates } from "./ping.enums.js";
import { PingService } from "./ping.service.js";

export class PingCommand implements interCommand {
    name = "ping";
    aliases = ["p", "pong"];

    async execute(message: interMessage, whatsapp: WhatsappService): Promise<void> {

        try {
            const start = Date.now()

            await whatsapp.readMessage( message.key )
            await whatsapp.sendPresenceUpdate('composing', message.chatId)
;
            const start_text = await PingService.get.message( enumPingStates.CALCULANDO );

            const sentMessage = await whatsapp.send.text( message.chatId, start_text );
            const end = Date.now();

            const diff = end - start;


            await wait(300)
            await whatsapp.sendPresenceUpdate('composing', message.chatId)
            await wait(3_000);


            const end_message = await PingService.get.message(enumPingStates.CALCULADO, diff);
            await whatsapp.editMessage(message.chatId, end_message, sentMessage.key );

            await whatsapp.sendPresenceUpdate('paused', message.chatId)

        } catch (error) {
            ERROR_LOG.INTERNAL('Ping')
            await whatsapp.send.text( message.chatId, 'Obtuve un error al calcular la latencia' )
        }
        
    }
}