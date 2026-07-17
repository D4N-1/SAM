import type WhatsappService from "../../../estructure/whatsapp.service.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import getHint from "./utils/say-hint.message.js";
import { enumError } from "../../../common/enums/error.enum.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default class SayCommand implements interfaceCommand {
    name = 'say';
    aliases = [ 'decir', 'di' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );
    
    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, quoted, captent, msg, sender, isGif } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        if ( captent?.split(' ')[1] === enumError.ERROR ) throw new Error( enumError.INTENTIONAL )

        const text = quoted.qCaptent || captent?.split(' ').slice(1).join(' ');

        const image = await quoted.qImage() || await message.image();
        const video = await quoted.qVideo() || await message.video();
        const audio = await quoted.qAudio() || await message.audio();
        const ptt = message.ptt || quoted.qPtt;
        const gifPlayback = isGif||quoted?.qIsGif
        const sticker = await quoted.qSticker();
        const document = await quoted.qDocument() || await message.document();
        const mimetype = quoted.qMimetype;
        const fileName = message.fileName || quoted.qFileName;

        if (!text && !image && !video && !sticker && !document && !audio) return await sam.sendMessage(chatId, { text: getHint(), reply: { msg, sender } } );

        if (image) return await sam.sendMessage(chatId, { caption: text, image } )
            if (video) return await sam.sendMessage(chatId, { caption: text, video, gifPlayback } )
                if (sticker) return await sam.sendMessage(chatId, { sticker } )
                    if (document) return await sam.sendMessage(chatId, { caption: text, mimetype, document, fileName })
                        if (audio) return await sam.sendMessage(chatId, { audio, ptt })
            
        return await sam.sendMessage(chatId, { text } )

    }
}