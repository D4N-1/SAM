import type { interMessage } from "../messages/msg.types.js";
import { msgERROR_USER_MESSAGES } from "../common/messages/error.message.js";
import type { interCommand } from "./command.interface.js";
import { WhatsappService } from "../estructure/whatsapp.service.js";
import type { WASocket } from "@itsukichan/baileys";
import { ALL_COMMANDS } from "./modules/index.js";
import { Logger } from "../common/utils/logger.util.js";

export class CommandRouter {
    private commands = new Map<string, interCommand>

    constructor() {}

    public registerCommands() {

        for (const commandClass of ALL_COMMANDS) {
            const start = performance.now();

            const commandInstance = new commandClass();
            this.add(commandInstance);

            Logger('CommandRouter', `Mapped ${commandInstance.name}`, start)
        }
    }

    private add(command: interCommand) {
        this.commands.set(command.name, command);
        command.aliases?.forEach( alias => this.commands.set(alias, command) )
    }

    async handler(sam: WASocket,message: interMessage) {

        if (!message.content?.startsWith("!")) return null;

        const commandName = message.content.trim().split(" ")[0]?.replace("!", "").toLowerCase();
        if (!commandName) return;

        const command = this.commands.get(commandName)
        if (!command) return;

        const whatsappService = new WhatsappService(sam);

        try {

            await command.execute(message, whatsappService);
            
        } catch (error) {
            console.error(error)
            await whatsappService.send.text(message.chatId, msgERROR_USER_MESSAGES.INTERNAL() )
        }
    }
}
