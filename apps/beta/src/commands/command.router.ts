import type interfaceCommand from "../common/interfaces/command.interface.js";
import type interfaceMessage from "../common/interfaces/parsed-message.interface.js";
import type { WASocket } from "@itsukichan/baileys";
import WhatsappService from "../estructure/whatsapp.service.js";
import { ALL_COMMANDS, GLOBAL_MIDDLEWARES } from "./command.module.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";
import GetErrorMessage from "../common/messages/error-status.message.js";
import { MiddlewarePipeline } from "../common/utils/middleware-pipeline.util.js";


export class CommandRouter {
    private commands = new Map<string, interfaceCommand>
    private globalMiddlewares: any[] = [];

    constructor() {
        this.registerGlobalMiddlewares()
        this.registerCommands()
    }

    private registerGlobalMiddlewares() {

        for (const midleware of GLOBAL_MIDDLEWARES) {
            this.globalMiddlewares.push(new midleware())
        }
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

    public async handler(samSocket: WASocket, message: interfaceMessage) {

        const sam = new WhatsappService(samSocket);

        try {

            const pipeline = new MiddlewarePipeline();

            for (const globalMiddleware of this.globalMiddlewares) pipeline.use(globalMiddleware);

            await pipeline.execute({ message, sam }, async() => {

                if (message.isFromMe) return;

                if (!message?.captent?.startsWith("!")) return;
        
                const commandName = message.captent.trim().split(" ")[0]?.split('.')[0]?.replace("!", "").toLowerCase();
                if (!commandName) return;

                const command = this.commands.get(commandName)
                if (!command) return;

                try {
                    await command.execute(message, sam)

                } catch (error:any) {

                    const name = command.name;

                    if (error.message !== 'INTENCIONAL') {
                        Logger.error(`${name.toUpperCase()}Module`, 'Internal')
                        console.error(error)
                    }
                    sam.send.text(message.chatId, await GetErrorMessage(name), { canal: true, reply: { msg: message, sender: message.sender }})
                }
            })

        } catch (error: any) {
            Logger.error('CommandRouter', 'Error detectado en el flujo del pipeline');
            console.error(error);
        }
        
    }
}

const commandRouter = new CommandRouter()
export default commandRouter;