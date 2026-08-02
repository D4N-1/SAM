import path from "node:path";
import type interfaceCommand from "../../../common/interfaces/command.interface.ts";
import { fileURLToPath } from "node:url";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.ts";
import type WhatsappService from "../../../estructure/whatsapp.service.ts";
import syncGroups from "../../../common/utils/sync-manager.util.ts";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware.ts";
import { AdminMiddleware } from "../../../common/middlewares/admin.middleware.ts";


export class ReloadCommand implements interfaceCommand {
    name = 'reload';
    aliases = [ 'recargar', 'reiniciar' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    middlewares = [ GroupChatMiddleware ];

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId } = message;

        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        await syncGroups(sam, chatId)

        await sam.sendMessage(chatId, { text: 'Datos del grupo, recargados' })

        await sam.sendPresenceUpdate('paused', chatId)
    }
}