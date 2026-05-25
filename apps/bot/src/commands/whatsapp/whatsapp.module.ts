import axios from "axios";
import type interfaceCommand from "../../common/interfaces/command.type.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.type.js";
import Logger from "../../common/utils/logger.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import imageBackUrl from "./utils/whatsapp-url.js";
import { getText } from "./utils/whatsapp.messages.js";


export default class WhatsappCommand implements interfaceCommand {
    name = 'whatsapp';
    aliases = [ 'ws' ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, senderAlt, sender, quoted, mentionedJid } = message;

        try {

            sam.readMessage(key);
            sam.sendPresenceUpdate('composing', chatId);

            const user = quoted.qSender || mentionedJid || senderAlt || sender;

            const contact = await sam.onWhatsApp(user!);
            if (!contact || contact?.length === 0) return sam.send.text(chatId, 'Ese contacto de whatsapp no existe')

            const status: any = await sam.fetchStatus(user!);
            const info = status?.[0]?.status?.status;
            const updated = status?.[0]?.status?.setAt
            
            const imageUrl: string = ( await sam.profilePictureUrl(user!) ) || imageBackUrl()

            const image = Buffer.from( (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data, 'binary')

            const text = await getText('N/A', user, info, updated)

            await sam.send.image(chatId, text, image)
            
        } catch (error) {
            Logger('WhatsappModule', 'Internal', null, true)
            console.error(error)
        }
    }
}