import path from "node:path";
import interfaceCommand from "../../../common/interfaces/command.interface";
import { fileURLToPath } from "node:url";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware";
import interfaceMessage from "../../../common/interfaces/parsed-message.interface";
import WhatsappService from "../../../estructure/whatsapp.service";
import { enumError } from "../../../common/enums/error.enum";
import { interfaceGroup } from "../../../common/interfaces/group.interface";



export class SetNameCommand implements interfaceCommand {
    name = 'setname';
    aliases = [  ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId, captent } = message;

        await sam.readMessage(key)
        await sam.sendPresenceUpdate("composing", chatId)
        
        const arg = captent?.split(' ').slice(1).join(' ').trim().replace(/[+@]|-(?!e)/g, '')
        
        if (arg === enumError.ERROR) throw new Error(enumError.INTENTIONAL)
        
        if (!arg) return sam.sendMessage(chatId, { text: 'Falta el nombre' } );
        await sam.groupUpdateSubject(chatId, arg);
        
    }
}