import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";


export class PrivateChatMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {

        const { isPrivate, chatId, sender, msg } = context.message;

        if (isPrivate) await next()
            else return context.sam.sendMessage(chatId, { text: 'Debes estar en chat privado para usar este comando', reply: { msg, sender } })
    }
}