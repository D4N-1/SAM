import type interfaceCommand from "../common/interfaces/command.interface.js";
import type interfaceMessage from "../common/interfaces/parsed-message.interface.js";
import type { WASocket } from "@itsukichan/baileys";
import WhatsappService from "../estructure/whatsapp.service.js";
import { ALL_COMMANDS } from "./command.module.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";
import GetErrorMessage from "../common/messages/error-status.message.js";


export default class CommandRouter {
    private commands = new Map<string, interfaceCommand>

    constructor() {
        this.registerCommands()
    }

    public registerCommands() {

        for (const commandClass of ALL_COMMANDS) {
            const start = performance.now();

            const commandInstance = new commandClass();
            this.add(commandInstance);

            Logger.log(enumContext.CommandRouter, `Mapped ${commandInstance.name}`, start)
        }
    }

    private add(command: interfaceCommand) {
        this.commands.set(command.name, command);
        command.aliases?.forEach( alias => this.commands.set(alias, command) )
    }

    public async handler(sam: WASocket, message: interfaceMessage) {

        if (!message?.captent?.startsWith("!")) return;
        if (message.isFromMe) return;
        
        const commandName = message.captent.trim().split(" ")[0]?.replace("!", "").toLowerCase();
        if (!commandName) return;

        const command = this.commands.get(commandName)
        if (!command) return;

        const whatsappService = new WhatsappService(sam);

        try {

            await command.execute(message, whatsappService);
            
        } catch (error: any) {
            const name = command.name;

            if (error.message !== 'INTENCIONAL') {
                Logger.error(`${name.toUpperCase()}Module`, 'Internal')
                console.error(error)
            }
            whatsappService.send.text(message.chatId, await GetErrorMessage(name))
        }
        
    }
}
