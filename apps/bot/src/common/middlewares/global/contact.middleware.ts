import type { CommandContext, NextFunction, SamMiddleware } from "../../interfaces/middleware.interface.js";
import { Api } from "../../utils/api.util.js";
import Logger from "../../utils/logger.util.js";


export class ContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { message } = context;
        const { sender, senderAlt, pushName } = message;

        try {
            
            if ( ![ senderAlt, sender ].some( i => i?.endsWith('@s.whatsapp.net') ) ) return next();

            const uid = senderAlt?.endsWith('@s.whatsapp.net') ? senderAlt : sender;

            const lid = senderAlt?.endsWith('@s.whatsapp.net') ? sender : senderAlt;


            const resUid = await Api.get(`/contacts/${uid}`);
            const resLid = await Api.get(`/contacts/lid/${lid}`)


            if ( resUid?.status !== 404 || resLid?.status !== 404 ) {

                const contact = resLid?.data || resUid?.data;

                if (pushName && contact.name !== pushName) await Api.patch(`/contacts/${uid}`, {
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