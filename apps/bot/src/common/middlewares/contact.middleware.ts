import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.ts";


export class ContactMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { quoted, mentionedJid, senderAlt, sender, captent } = context.message;
        const sam = context.sam;

        const arg = captent?.split(' ').slice(1).join('').trim().replace(/[+@]|-(?!e)/g, '')

        let user = quoted.qSender || mentionedJid || arg?.replace('@','') || senderAlt || sender;
        
        user = user?.endsWith('@s.whatsapp.net') || user?.endsWith('@lid') ? user : user + '@s.whatsapp.net'
        
        const contact = await sam.onWhatsApp(user!);
        const apiContact = await sam.getContact(user);
        context.metadata = {
            user,
            contact,
            apiContact
        }

        next();
    }
}