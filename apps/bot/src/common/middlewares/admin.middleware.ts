import type { interfaceGroup } from "../interfaces/group.interface.js";
import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";



export class AdminMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { sender, senderAlt, chatId, msg } = context.message;

        const group: interfaceGroup = context?.metadata?.group || await context.sam.groupMetadata(chatId);

        context.metadata.group = group;


        const isAdmin = group.participants.some( p => 
            (p.id === sender || p.lid === senderAlt) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!isAdmin) return context.sam.sendMessage(chatId, { text: '𝗡𝗼 𝗲𝗿𝗲𝘀 𝗮𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝗱𝗼𝗿', reply: { msg, sender } })
        await next();
    }
}

export class BotAdminMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { chatId, botNumber, msg, sender } = context.message;

        const group: interfaceGroup = context.metadata?.group || await context.sam.groupMetadata(chatId);

        context.metadata.group = group;

        const botAdmin = group.participants.some( p => 
            (p.id === botNumber || p.lid === botNumber || p.phoneNumber === botNumber) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!botAdmin) return context.sam.sendMessage(chatId, { text: '𝗡𝗼 𝘀𝗼𝘆 𝗮𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝗱𝗼𝗿 𝗽𝗮𝗿𝗮 𝗿𝗲𝗮𝗹𝗶𝘇𝗮𝗿 𝗲𝘀𝗮 𝗮𝗰𝗰𝗶𝗼𝗻', reply: { msg, sender } })
        await next();
    }
}