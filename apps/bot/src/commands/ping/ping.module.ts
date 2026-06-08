import { wait } from "../../common/utils/function.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import { enumPingStates } from "./utils/ping.enums.js";
import { PingService } from "./utils/ping.message.js";
import { enumError } from "../../common/enums/error.enum.js";


export default class PingCommand implements interfaceCommand {
    pingService: PingService;

    constructor() {
        this.pingService = new PingService()
    }

    name = 'ping';
    aliases = ['p', 'pong'];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {

        const { key, chatId, captent, msg, sender, isPrivate } = message;

        const start = Date.now()

        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        if ( captent?.split(' ')[1] === enumError.ERROR ) throw new Error( enumError.INTENTIONAL )

        const start_text = await this.pingService.getMessage( enumPingStates.CALCULANDO );

        const sentMessage = await sam.sendMessage( chatId, { text: start_text, reply: { msg, sender }, ai: isPrivate } );
        const end = Date.now();

        const diff = end - start;


        await wait(300)
        await sam.sendPresenceUpdate('composing', chatId)
        await wait(3_000);


        const end_message = await this.pingService.getMessage(enumPingStates.CALCULADO, diff);
        await sam.sendMessage(chatId, { text: end_message, edit: sentMessage.key, reply: { msg, sender, }, ai: isPrivate  });

        await sam.sendPresenceUpdate('paused', chatId)

    }
}