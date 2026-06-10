import type { CommandContext, NextFunction, SamMiddleware } from "../../interfaces/middleware.interface.js";
import { Api } from "../../utils/api.util.js";
import Logger from "../../utils/logger.util.js";


export class ContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { message } = context;
        const { sender, senderAlt, pushName } = message;

        try {
            
            if ( ![ senderAlt, sender ].some( i => i?.endsWith('@s.whatsapp.net') ) ) return next();

            const uid = senderAlt?.endsWith('@s.whatsapp.net') ? senderAlt?.split('@')[0] :
                sender?.split('@')[0];

            const lid = sender?.endsWith('@') ? sender?.split('@')[0] :
                senderAlt?.split('@')[0];

            const res = await Api.get(`/contacts/uid/${uid}`);

            if (res?.status === 200) {

                const contact = res.data;

                if (contact.name !== pushName) await Api.patch(`/contacts/${uid}`, {
                    name: pushName
                });

                if (!pushName) context.message.pushName = contact.name;
                return next();
            }

            await Api.post(`/contacts`, {
                uid,
                lid,
                name: pushName
            });

            console.log('[] - NUEVO CONTACTO CREADO');
            next();

        } catch (error) {
            Logger.error('ContactMiddleware', 'Error al obtener /contacts/uid');
        }
    }
}