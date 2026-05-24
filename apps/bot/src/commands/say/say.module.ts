import type { WhatsappService } from "../../estructure/whatsapp.service.js";
import type { interMessage } from "../../common/types/parsed-message.type.js";
import type { interCommand } from "../../common/types/command.type.js";



export class SayCommand implements interCommand {
    name = 'say';
    aliases = [];

    async execute(message: interMessage, whatsapp: WhatsappService): Promise<void> {
        
        try {


        } catch (error) {}
    }
}