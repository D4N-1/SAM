import path from "node:path";
import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import { fileURLToPath } from "node:url";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware.js";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import WhatsappService from "../../../estructure/whatsapp.service.js";
import { enumError } from "../../../common/enums/error.enum.js";



export class SetDescriptionCommand implements interfaceCommand {
    name = 'setdescription';
    aliases = [ 'setdesc', 'groupdesc' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId, captent } = message;

        await sam.readMessage(key)
        await sam.sendPresenceUpdate("composing", chatId)
        
        const arg = captent?.split(' ').slice(1).join(' ').trim().replace(/[+@]|-(?!e)/g, '')
        
        if (arg === enumError.ERROR) throw new Error(enumError.INTENTIONAL)
        
        if (!arg) return sam.sendMessage(chatId, { text: 'Falta la descripción' } );
        await sam.groupUpdateDescription(chatId, arg);
        
    }
}