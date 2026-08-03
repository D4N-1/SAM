import type WhatsappService from "../../../estructure/whatsapp.service.ts";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.ts";
import type interfaceCommand from "../../../common/interfaces/command.interface.ts";
import { enumError } from "../../../common/enums/error.enum.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default class TestCommand implements interfaceCommand {
    name = 'test';

    dirname = path.dirname( fileURLToPath( import.meta.url ) );
    
    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId } = message;


        await sam.readMessage( key );
        await sam.sendPresenceUpdate('composing', chatId);

        return await sam.sendMessage('D4N1_115', { text: 'Funciona' } )

    }
}