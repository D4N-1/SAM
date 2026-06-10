import type interfaceCommand from "../common/interfaces/command.interface.js";
import type interfaceMessage from "../common/interfaces/parsed-message.interface.js";
import WhatsappService from "../estructure/whatsapp.service.js";
import { ALL_COMMANDS, GLOBAL_MIDDLEWARES } from "./command.module.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";
import GetErrorMessage from "../common/messages/error-status.message.js";
import { MiddlewarePipeline } from "../common/utils/middleware-pipeline.util.js";
import { enumError } from "../common/enums/error.enum.js";


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

        for (const alias of command?.aliases ?? []) this.commands.set(alias, command);
    }

    public async handler(samSocket: any, message: interfaceMessage) {

        const sam: WhatsappService = new WhatsappService(samSocket);

        try {


            const context = {
                message,
                sam,
                metadata: {}
            }

            const globalPipeline = new MiddlewarePipeline();

            for (const globalMiddleware of this.globalMiddlewares) globalPipeline.use(globalMiddleware);

            await globalPipeline.execute(context, async() => {

                if (message.isFromMe) return;

                if (!message?.captent?.startsWith("!")) return;
        
                const commandName = message.captent.trim().split(" ")[0]?.split('.')[0]?.replace("!", "").toLowerCase();
                if (!commandName) return;

                const command = this.commands.get(commandName)
                if (!command) return;

                const internalPipeline = new MiddlewarePipeline();

                for (const internalMiddleware of command.middlewares ?? []) internalPipeline.use(new internalMiddleware() );
                

                await internalPipeline.execute(context, async() => {

                    try {
                        await command.execute(context.message, context.sam, context.metadata)

                    } catch (error:any) {

                        const name = command.name;

                        if (error.message !== enumError.INTENTIONAL) {
                            Logger.error(`${name.toUpperCase()}Module`, 'Internal')
                            console.error(error)
                        }
                        sam.sendMessage(message.chatId, { text: await GetErrorMessage(command), canal: true, reply: { msg: message, sender: message.sender }})
                    }
                })
            })

        } catch (error: any) {
            Logger.error('CommandRouter', 'Error detectado en el flujo del pipeline');
            console.error(error);
        }
        
    }
}

const commandRouter = new CommandRouter()
export default commandRouter;