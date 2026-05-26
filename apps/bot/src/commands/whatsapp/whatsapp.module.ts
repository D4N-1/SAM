import axios from "axios";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import imageBackUrl from "./utils/whatsapp-url.js";
import { getText } from "./utils/whatsapp.messages.js";
import getHint from "./utils/whatsapp-hint.message.js";
import { downloadImage } from "../../common/utils/image.util.js";


export default class WhatsappCommand implements interfaceCommand {
    name = 'whatsapp';
    aliases = [ 'ws' ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, captent, senderAlt, sender, quoted, mentionedJid } = message;

        sam.readMessage(key);
        sam.sendPresenceUpdate('composing', chatId);

        const arg = captent?.split(' ').slice(1).filter(p => !p.startsWith('@')).join('').trim();
        console.log(arg)

        if (arg === '-error') throw new Error('INTENCIONAL')
        let user = arg || quoted.qSender || mentionedJid || senderAlt || sender;

        const contact = await sam.onWhatsApp(user!);
        if (!contact || contact?.length === 0) return sam.send.text(chatId, getHint())

        
        user = user?.endsWith('@s.whatsapp.net') ? user : user + '@s.whatsapp.net'
        const status: any = await sam.fetchStatus(user!);
        const info = status?.[0]?.status?.status;
        const updated = status?.[0]?.status?.setAt
            
        const imageUrl: string = ( await sam.profilePictureUrl(user!) ) || imageBackUrl()

        const image = await downloadImage(imageUrl)

        const text = await getText('N/A', user, info, updated)

        await sam.send.image(chatId, text, image)
            
    }
}