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


            const [ resUid, resLid ] = await Promise.all([
                uid ? Api.get(`/contacts/${uid}`).catch(() => null) : null,
                lid ? Api.get(`/contacts/lid/${lid}`).catch(() => null) : null
            ])


            const contactLid = resLid?.data;
            const contactUid = resUid?.data;

            if ( contactLid || contactUid) {


                if (contactLid && lid) {

                    if ( (pushName && contactLid.name !== pushName) || (contactLid.uid !== uid) ) {
                        await Api.patch(`/contacts/lid/${lid}`, {
                            name: pushName,
                            uid: uid?.split('@')[0]
                        })
                    }

                }

                
                if (contactUid && uid) {

                    if ( (pushName && contactUid.name !== pushName) || (contactUid.lid !== lid) ) {
                        await Api.patch(`/contacts/${uid}`, {
                            name: pushName,
                            lid: lid?.split('@')[0]
                        })
                    }

                }


                if (!pushName) context.message.pushName = contactLid?.name || contactUid?.name;

                return next();

            }

            await Api.post(`/contacts`, {
                uid: uid?.split('@')[0],
                lid: uid?.split('@')[0],
                name: pushName
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