import { fileURLToPath } from "node:url";
import type interfaceCommand from "../../../common/interfaces/command.interface.ts";
import path from "node:path";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.ts";
import type WhatsappService from "../../../estructure/whatsapp.service.ts";
import { getText } from "./utils/group.messages.ts";



export class GroupCommand implements interfaceCommand {
    name = 'group';
    aliases = [ 'grupo' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId } = message;

        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        const chatUid: string = chatId.split('@')[0] as string;
        const group = await sam.getGroup( chatUid );
        const admins = group.participants?.filter( p => p.admin !== null)

        const text = await getText(group.name, group.community.name, group.description, group.participants?.length, admins?.length, group.creation)

        await sam.sendMessage(chatId, { text })

        await sam.sendPresenceUpdate('paused', chatId)
    }
}