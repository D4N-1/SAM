import { wait } from "../../common/utils/function.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import { enumPingStates } from "./utils/ping.enums.js";
import { PingService } from "./utils/ping.message.js";


export default class PingCommand implements interfaceCommand {
    name = 'ping';
    aliases = ['p', 'pong'];

    async execute(message: interfaceMessage,sam: WhatsappService): Promise<void> {

        const { key, chatId, captent } = message;

        const start = Date.now()

        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        if ( captent?.split(' ')[1] === '-error' ) throw new Error('INTENCIONAL')

        const start_text = await PingService.get.message( enumPingStates.CALCULANDO );

        const sentMessage = await sam.send.text( chatId, start_text );
        const end = Date.now();

        const diff = end - start;


        await wait(300)
        await sam.sendPresenceUpdate('composing', chatId)
        await wait(3_000);


        const end_message = await PingService.get.message(enumPingStates.CALCULADO, diff);
        await sam.editMessage(chatId, end_message, sentMessage.key );

        await sam.sendPresenceUpdate('paused', chatId)

    }
}