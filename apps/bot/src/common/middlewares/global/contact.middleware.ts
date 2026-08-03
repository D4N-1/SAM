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

            console.log('uid: ' + uid)
            console.log('lid: ' + lid)


            const [ resUid, resLid ] = await Promise.all([
                uid ? Api.get(`/contacts/${uid}`).catch(() => null) : null,
                lid ? Api.get(`/contacts/lid/${lid}`).catch(() => null) : null
            ])


            const contactLid: interfaceContact = resLid?.status !== 404 ? resLid?.data : null;
            const contactUid: interfaceContact = resUid?.status !== 404 ? resUid?.data : null;

            if (contactLid || contactUid) {


                if (contactLid && lid) {

                    const toUpdate: Record<string, any> = {};
                    const parsedUid = uid ? uid.split('@')[0] : undefined;

                    if ( pushName && contactLid.name !== pushName) toUpdate.name = pushName;

                    if (contactLid.uid !== parsedUid) toUpdate.uid = parsedUid;

                    if (username && contactLid.username !== username) toUpdate.username = username;


                    if (Object.keys(toUpdate).length > 0) {
                        console.log('[contactLID]  -  Actualización')
                        console.log(toUpdate)
                        await Api.patch(`/contacts/lid/${lid}`, toUpdate)
                    }
                    

                }

                
                if (contactUid && uid) {

                    const toUpdate: Record<string, any> = {};
                    const parsedLid = lid ? lid.split('@')[0] : undefined;


                    if ( pushName && contactUid.name !== pushName) toUpdate.name = pushName;
                    
                    if (contactUid.lid !== parsedLid) toUpdate.lid = parsedLid;

                    if (username && contactUid.username !== username) toUpdate.username = username;

                    
                    if ( Object.keys(toUpdate).length > 0) {
                        console.log('[contactUID]  -  Actualización')
                        console.log(toUpdate)
                        await Api.patch(`/contacts/${uid}`, toUpdate)
                    }

                }


                context.metadata.contact = contactLid || contactUid;
                return next();

            }

            const contact = { 
                uid: uid?.split('@')[0],
                lid: lid?.split('@')[0],
                name: pushName,
                username
            }
            await Api.post(`/contacts`, contact);

            console.log('[] - NUEVO CONTACTO CREADO');
            console.log(contact)
            next();

        } catch (error) {
            Logger.error('ContactMiddleware', 'Error al obtener sincronizar');
            console.log(error)
            return next();
        }
    }
}