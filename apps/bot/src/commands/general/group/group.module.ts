import { fileURLToPath } from "node:url";
import type interfaceCommand from "../../../common/interfaces/command.interface.ts";
import path from "node:path";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.ts";
import type WhatsappService from "../../../estructure/whatsapp.service.ts";



export class GroupCommand implements interfaceCommand {
    name = 'group';
    aliases = [ 'grupo' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId } = message;

        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        const group = await sam.getGroup(chatId);

        await sam.sendPresenceUpdate('paused', chatId)
    }
}