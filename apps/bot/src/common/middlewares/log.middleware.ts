import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";


export class LogMiddleware implements SamMiddleware {
    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        console.log('LOG')
        console.log(context.message.senderAlt)

        await next();
    }
}