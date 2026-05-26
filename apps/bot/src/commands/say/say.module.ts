import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import getHint from "./utils/say-hint.message.js";

export default class SayCommand implements interfaceCommand {
    name = 'say';
    aliases = [ 'decir' ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, quoted, captent, msg, sender } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', message?.chatId);

        if (captent?.split(' ')[1] === '-error') throw new Error('INTENCIONAL')

        const text = quoted.qCaptent || captent?.split(' ').slice(1).join(' ');

        const image = await quoted.qImage() || await message.image();
        const video = await quoted.qVideo() || await message.video();
        const sticker = await quoted.qSticker();

        if (!text && !image && !video && !sticker) return await sam.send.text(chatId, getHint());

        if (image) return await sam.send.image(chatId, text!, image!, { reply: { msg, sender } } )
            if (video) return await sam.send.video(chatId, text!, video!, { reply: { msg, sender } } )
                if (sticker) return await sam.send.sticker(chatId, sticker, { reply: { msg, sender } } )
            
        return await sam.send.text(chatId, text!, { reply: { msg, sender } } )

    }
}