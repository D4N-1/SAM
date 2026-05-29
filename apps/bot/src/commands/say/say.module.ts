import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import getHint from "./utils/say-hint.message.js";
import { enumError } from "../../common/enums/error.enum.js";

export default class SayCommand implements interfaceCommand {
    name = 'say';
    aliases = [ 'decir' ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, quoted, captent, msg, sender } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', message?.chatId);

        if ( captent?.split(' ')[1] === enumError.ERROR ) throw new Error( enumError.INTENTIONAL )

        const text = quoted.qCaptent || captent?.split(' ').slice(1).join(' ');

        const image = await quoted.qImage() || await message.image();
        const video = await quoted.qVideo() || await message.video();
        const sticker = await quoted.qSticker();

        if (!text && !image && !video && !sticker) return await sam.send.text(chatId, getHint(), { reply: { msg, sender } } );

        if (image) return await sam.send.image(chatId, text!, image! )
            if (video) return await sam.send.video(chatId, text!, video! )
                if (sticker) return await sam.send.sticker(chatId, sticker )
            
        return await sam.send.text(chatId, text! )

    }
}