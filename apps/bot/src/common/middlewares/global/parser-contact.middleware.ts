import type { CommandContext, NextFunction, SamMiddleware } from "../../interfaces/middleware.interface.js";
import Logger from "../../utils/logger.util.js";


export class ParserContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {

        try {

            const uid = context.metadata.contact.uid;
            const lid = context.metadata.contact.lid;
            context.message.sender = uid ? uid + '@s.whatsapp.net' : null;
            context.message.senderAlt = lid ? lid + '@lid' : null;

            next()

        } catch (error) {
            Logger.error('ContactMiddleware', 'Error al parsear contacto');
            console.log(error)
            return next();
        }
    }
}