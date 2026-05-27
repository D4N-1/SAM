import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";
import { Api } from "../utils/api.util.js";
import Logger from "../utils/logger.util.js";


export class ContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { message } = context;
        const { sender, senderAlt, pushName, botUid } = message;

        try {
            
            if (!senderAlt) return next();

            const uid = senderAlt.split('@')[0];
            const lid = sender?.split('@')[0];

            const res = await Api.get(`/contacts/uid/${uid}`, { uid: botUid! }).catch()

            if (res?.status === 200) return next()

            const post = await Api.post(`/contacts`, {
                uid,
                lid,
                name: pushName
            }).catch()

            console.log(post.data)
            next()

        } catch (error) {
            Logger.error('ContactMiddleware', 'Error al obtener /contacts/uid')
        }
    }
}