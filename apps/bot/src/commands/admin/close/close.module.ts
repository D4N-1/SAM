import { fileURLToPath } from "node:url";
import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import path from "node:path";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware.js";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import WhatsappService from "../../../estructure/whatsapp.service.js";


export class CloseCommand implements interfaceCommand {
    name = 'close';
    aliases = [  ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', message?.chatId);

        await sam.groupSettingUpdate(chatId, 'announcement');

    }
}