import path from "node:path";
import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import { fileURLToPath } from "node:url";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware.js";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import WhatsappService from "../../../estructure/whatsapp.service.js";
import { enumError } from "../../../common/enums/error.enum.js";


export class EveryoneAdminCommand implements interfaceCommand {
    name = 'everyoneadmin'
    aliases = [ 'alladmin', 'tagadmin', 'admins' ]

    dirname = path.dirname( fileURLToPath( import.meta.url ) )

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {

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
        const admins = group.participants
            .filter((p: { admin: string; }) => p.admin === 'admin' || p.admin === 'superadmin')
            .map((p: { phoneNumber: any; id: any; lid: any; }) => p.phoneNumber || p.id || p.lid);


        if (!text && !image && !video && !sticker && !document && !audio) return await sam.sendMessage(chatId, { text: '@𝗔𝗗𝗠𝗜𝗡𝗦', mentions: admins } );

        if (image) return await sam.sendMessage(chatId, { caption: '@𝗔𝗗𝗠𝗜𝗡𝗦\n\n' + text, image, mentions: admins } )
            if (video) return await sam.sendMessage(chatId, { caption: '@𝗔𝗗𝗠𝗜𝗡𝗦\n\n' + text, video, gifPlayback, mentions: admins } )
                if (sticker) return await sam.sendMessage(chatId, { sticker, mentions: admins } )
                    if (document) return await sam.sendMessage(chatId, { caption: '@𝗔𝗗𝗠𝗜𝗡𝗦\n\n' + text, mimetype, document, fileName, mentions: admins })
                        if (audio) return await sam.sendMessage(chatId, { audio, ptt, mentions: admins })
            
        return await sam.sendMessage(chatId, { text: '@𝗔𝗗𝗠𝗜𝗡𝗦\n\n' + text, mentions: admins } )
    }
}