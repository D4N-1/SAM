import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";


export class ContactMiddleware implements SamMiddleware {

    use(context: CommandContext, next: NextFunction): Promise<void> | void {
        
        const { message } = context;
        const { senderAlt } = message;

        if (!senderAlt) return next();

        console.log(senderAlt)
        next()
    }
}