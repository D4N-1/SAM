import type { WhatsappService } from "../../estructure/whatsapp.service.js";
import type { interfaceMessage } from "../../common/interfaces/parsed-message.type.js";
import type { interfaceCommand } from "../../common/interfaces/command.type.js";
import { enumMessage } from "../../common/enums/type-mesage.enum.js";
import { Logger } from "../../common/utils/logger.util.js";



export class SayCommand implements interfaceCommand {
    name = 'say';
    aliases = [];

    async execute(message: interfaceMessage, whatsapp: WhatsappService): Promise<void> {
        
        try {

            const text = message.captent?.split(' ').slice(1).join(' ');
            if (!text) return await whatsapp.send.text(message.chatId, '⭕ Te falta el \`texto\` o \`contenido\` que deseas que diga');

            const image = await message.image();
            const video = await message.video();

            if (message.contentType === enumMessage.imageMessage) return await whatsapp.send.image(message.chatId, text, image!)
            if (message.contentType === enumMessage.videoMessage) return await whatsapp.send.video(message.chatId, text, video!)
            
                return await whatsapp.send.text(message.chatId, text)

        } catch (error) {
            Logger('sayModule', 'Error interno', null, true)
            console.error(error)
        }
    }
}