import type { WhatsappService } from "../estructure/whatsapp.service.js";
import type { interMessage } from "../messages/msg.types.js";


export interface interCommand {

    name: string,
    aliases?: string[],
    execute(message: interMessage, whatsapp: WhatsappService): Promise<void>
}