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

            await whatsapp.readMessage( message.key );
            await whatsapp.sendPresenceUpdate('composing', message?.chatId);

            const text = message.quoted.qCaptent || message.captent?.split(' ').slice(1).join(' ');

            const image = await message.quoted.qImage() || await message.image();
            const video = await message.quoted.qVideo() || await message.video();

            if (!text && !image && !video) return await whatsapp.send.text(message.chatId, '⭕ Te falta el \`texto\` o \`contenido\` que deseas que diga');

            if (image) return await whatsapp.send.image(message.chatId, text!, image!)
            if (video) return await whatsapp.send.video(message.chatId, text!, video!, message.quoted.qIsGif)
            
                return await whatsapp.send.text(message.chatId, text!)

        } catch (error) {
            Logger('sayModule', 'Error interno', null, true)
            console.error(error)
        }
    }
}