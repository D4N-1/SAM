import path from "node:path";
import { enumError } from "../../../common/enums/error.enum.js";
import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import type WhatsappService from "../../../estructure/whatsapp.service.js";
import { presentationCommand, telemetryCommand } from "./bot.service.js";
import { fileURLToPath } from "node:url";


export default class BotCommand implements interfaceCommand {
    name = 'bot';
    aliases = [];

    dirname = path.dirname( fileURLToPath( import.meta.url ) )
    
    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, captent } = message;

        sam.readMessage(key);
        sam.sendPresenceUpdate('composing', chatId);

        if (captent?.split(' ')[1] === enumError.ERROR) throw new Error(enumError.INTENTIONAL)

        const arg = captent?.split(' ')[0];

        if (arg?.split('.')[1] === 'tel') return await telemetryCommand(message, sam);
        else return await presentationCommand(message, sam);
    }
}