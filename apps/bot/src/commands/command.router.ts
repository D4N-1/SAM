import type { interMessage } from "../messages/msg.types.js";
import { ERROR_LOG } from "../common/utils/error-log.util.js";
import type { interCommand } from "./command.interface.js";
import { WhatsappService } from "../estructure/whatsapp.service.js";
import type { WASocket } from "@itsukichan/baileys";
import { ALL_COMMANDS } from "./command.module.js";
import { Logger } from "../common/utils/logger.util.js";
import { ERROR_USER } from "../common/utils/error-log.util.js";


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

    public async handler(sam: WASocket,message: interMessage) {

        const commandName = message.content.trim().split(" ")[0]?.replace("!", "").toLowerCase();
        if (!commandName) return;

        const command = this.commands.get(commandName)
        if (!command) return;

        const whatsappService = new WhatsappService(sam);

        try {

            await command.execute(message, whatsappService);
            
        } catch (error) {
            ERROR_LOG.INTERNAL('CommandRouter')
            await whatsappService.send.text(message.chatId, ERROR_USER.INTERNAL('el comando') )
        }
    }
}
