import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";


export class GroupChatMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {

        const { isPrivate, chatId } = context.message;

        if ( isPrivate ) context.sam.sendMessage(chatId, { text: 'Para usar este comando, debes estar en un grupo', ai: true })
            else await next()
    }
}