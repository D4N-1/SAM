import path from "node:path";
import interfaceCommand from "../../../common/interfaces/command.interface";
import { fileURLToPath } from "node:url";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware";
import interfaceMessage from "../../../common/interfaces/parsed-message.interface";
import WhatsappService from "../../../estructure/whatsapp.service";
import { enumError } from "../../../common/enums/error.enum";


export class EveryoneCommand implements interfaceCommand {
    name = 'everyone'
    aliases = [ 'all', 'tag' ]

    dirname = path.dirname( fileURLToPath( import.meta.url ) )

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata): Promise<void> {

        const { key, chatId, quoted, captent, isGif } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', message?.chatId);

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

        const group = metadata.group;

        const participants = group.participants.map( p => p.phoneNumber || p.id || p.lid)

        if (!text && !image && !video && !sticker && !document && !audio) return await sam.sendMessage(chatId, { text: '@𝗧𝗢𝗗𝗢𝗦', mentionAll: true } );

        if (image) return await sam.sendMessage(chatId, { caption: '@𝗧𝗢𝗗𝗢𝗦\n\n' + text, image, mentionAll: true } )
            if (video) return await sam.sendMessage(chatId, { caption: '@𝗧𝗢𝗗𝗢𝗦\n\n' + text, video, gifPlayback, mentionAll: true } )
                if (sticker) return await sam.sendMessage(chatId, { sticker, mentionAll: true } )
                    if (document) return await sam.sendMessage(chatId, { caption: '@𝗧𝗢𝗗𝗢𝗦\n\n' + text, mimetype, document, fileName, mentionAll: true })
                        if (audio) return await sam.sendMessage(chatId, { audio, ptt, mentionAll: true })
            
        return await sam.sendMessage(chatId, { text: '@𝗧𝗢𝗗𝗢𝗦\n\n' + text, mentionAll: true } )
    }
}