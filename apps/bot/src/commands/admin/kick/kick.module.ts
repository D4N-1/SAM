import { fileURLToPath } from "node:url";
import interfaceCommand from "../../../common/interfaces/command.interface";
import interfaceMessage from "../../../common/interfaces/parsed-message.interface";
import { AdminMiddleware, BotAdminMiddleware } from "../../../common/middlewares/admin.middleware";
import { GroupChatMiddleware } from "../../../common/middlewares/group-chat.middleware";
import WhatsappService from "../../../estructure/whatsapp.service";
import path from "node:path";
import { enumError } from "../../../common/enums/error.enum";
import { interfaceGroup } from "../../../common/interfaces/group.interface";


export class KickCommand implements interfaceCommand {
    name = 'kick';
    aliases = [ 'ban' ]

    dirname = path.dirname( fileURLToPath( import.meta.url ) );

    middlewares = [ GroupChatMiddleware, AdminMiddleware, BotAdminMiddleware ]

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId, quoted, mentionedJid, captent, msg, sender } = message;
        
        await sam.readMessage(key)
        await sam.sendPresenceUpdate("composing", chatId)
        
        const arg = captent?.split(' ').slice(1).join('').trim().replace(/[+@]|-(?!e)/g, '')
        
        if (arg === enumError.ERROR) throw new Error(enumError.INTENTIONAL)
        
        let user = quoted.qSender || mentionedJid || arg?.replace('@','');
        
        user = user?.endsWith('@s.whatsapp.net') || user?.endsWith('@lid') ? user : user + '@s.whatsapp.net'
        
        if (!user) return sam.sendMessage(chatId, { text: 'Menciona a quien deseas expulsar del grupo', reply: { msg, sender } })
        
        const group: interfaceGroup = metadata.group || await sam.groupMetadata(chatId)
        const exists = group.participants.find( p => p.id === user ||
            p.lid === user ||
            p.phoneNumber === user)
        
        if (!exists) return sam.sendMessage(chatId, { text: 'Ese contacto no existe o no está en este grupo', reply: { msg, sender } })
                
        await sam.groupParticipantsUpdate(chatId, user, 'remove');
                
    }
}