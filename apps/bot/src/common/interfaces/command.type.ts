import type { WhatsappService } from "../../estructure/whatsapp.service.js";
import type { interfaceMessage } from "./parsed-message.type.js";


export interface interfaceCommand {

    name: string,
    aliases?: string[],
    execute(message: interfaceMessage, whatsapp: WhatsappService): Promise<void>
}