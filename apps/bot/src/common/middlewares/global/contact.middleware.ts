import type { interfaceContact } from "../../interfaces/contact.interface.ts";
import type { CommandContext, NextFunction, SamMiddleware } from "../../interfaces/middleware.interface.js";
import { Api } from "../../utils/api.util.js";
import Logger from "../../utils/logger.util.js";


export class ContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { message } = context;
        const { sender, senderAlt, pushName, username } = message;

        try {
            
            const uid = senderAlt?.endsWith('@s.whatsapp.net') ? senderAlt : sender;
            const lid = senderAlt?.endsWith('@s.whatsapp.net') ? sender : senderAlt;


            const [ resUid, resLid ] = await Promise.all([
                uid ? Api.get(`/contacts/${uid}`).catch(() => null) : null,
                lid ? Api.get(`/contacts/lid/${lid}`).catch(() => null) : null
            ])


            const contactLid: interfaceContact = resLid?.status !== 404 ? resLid?.data : null;
            const contactUid: interfaceContact = resUid?.status !== 404 ? resUid?.data : null;

            if (contactLid || contactUid) {


                if (contactLid && lid) {

                    if (
                        (pushName && contactLid.name !== pushName) ||
                        (contactLid.uid !== uid) ||
                        (username && contactLid.username !== username)
                    ) {
                        await Api.patch(`/contacts/lid/${lid}`, {
                            username,
                            name: pushName,
                            uid: uid?.split('@')[0]
                        })
                    }

                }

                
                if (contactUid && uid) {

                    if (
                        (pushName && contactUid.name !== pushName) ||
                        (contactUid.lid !== lid) ||
                        (username && contactUid.username !== username)
                    ) {
                        await Api.patch(`/contacts/${uid}`, {
                            username,
                            name: pushName,
                            lid: lid?.split('@')[0]
                        })
                    }

                }


                if (!pushName) context.message.pushName = contactLid?.name || contactUid?.name;

                context.metadata.contact = contactLid || contactUid;
                return next();

            }

            await Api.post(`/contacts`, {
                uid: uid?.split('@')[0],
                lid: uid?.split('@')[0],
                name: pushName,
                username
            });

            console.log('[] - NUEVO CONTACTO CREADO');
            next();

        } catch (error) {
            Logger.error('ContactMiddleware', 'Error al obtener sincronizar');
            console.log(error)
            return next();
        }
    }
}