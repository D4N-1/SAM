import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.type.js";
import type interfaceCommand from "../../common/interfaces/command.type.js";
import Logger from "../../common/utils/logger.util.js";
import { msgERROR } from "./utils/error.messag.js";
import getHint from "./utils/say.messages.js";

export default class SayCommand implements interfaceCommand {
    name = 'say';
    aliases = [ 'decir' ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, quoted, captent } = message;
        try {

            await sam.readMessage( key );
            await sam.sendPresenceUpdate('composing', message?.chatId);

            if (captent?.split(' ')[1] === '-error') throw new Error('INTENCIONAL')

            const text = quoted.qCaptent || captent?.split(' ').slice(1).join(' ');

            const image = await quoted.qImage() || await message.image();
            const video = await quoted.qVideo() || await message.video();
            const sticker = await quoted.qSticker();

            if (!text && !image && !video && !sticker) return await sam.send.text(chatId, getHint());

            if (image) return await sam.send.image(chatId, text!, image!)
                if (video) return await sam.send.video(chatId, text!, video!, quoted.qIsGif)
                    if (sticker) return await sam.send.sticker(chatId, sticker)
            
            return await sam.send.text(chatId, text!)

        } catch (error:any) {
            if (error.message !== 'INTENCIONAL') {
                Logger('sayModule', 'Error interno', null, true)
                console.error(error)
            }
            sam.send.text(chatId, msgERROR())
        }
    }
}