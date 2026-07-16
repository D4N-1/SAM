import type interfaceCommand from "../../../common/interfaces/command.interface.js";
import type interfaceMessage from "../../../common/interfaces/parsed-message.interface.js";
import type WhatsappService from "../../../estructure/whatsapp.service.js";
import imageBackUrl from "./utils/whatsapp-random-url.util.js";
import { getText } from "./utils/whatsapp.messages.js";
import getHint from "./utils/whatsapp-hint-message.util.js";
import { downloadImage } from "../../../common/utils/image.util.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContactMiddleware } from "../../../common/middlewares/contact.middleware.js";
import { enumError } from "../../../common/enums/error.enum.js";


export default class WhatsappCommand implements interfaceCommand {
    name = 'whatsapp';
    aliases = [ 'ws' ];

    dirname = path.dirname( fileURLToPath( import.meta.url ) )

    middlewares = [ ContactMiddleware ]

    async execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void> {
        
        const { key, chatId, captent } = message;

        sam.readMessage(key);
        sam.sendPresenceUpdate('composing', chatId);

        const arg = captent?.split(' ').slice(1).join('').trim().replace(/[+@]|-(?!e)/g, '')

        const { contact, apiContact, user } = metadata;

        
        if (!contact && !apiContact) return sam.sendMessage(chatId, { text: getHint() })

        if (arg === enumError.ERROR) throw new Error(enumError.INTENTIONAL)

        const status: any = await sam.fetchStatus(user!);
        const info: string | undefined = status?.[0]?.status?.status?.trim();
        const updated = status?.[0]?.status?.setAt;

        let imageUrl: string;
        try { ( imageUrl = await sam.profilePictureUrl(user!) )  } catch { imageUrl = imageBackUrl() }

        const image = await downloadImage(imageUrl)
        
        const name = apiContact.name;

        const text = await getText(name, apiContact.uid, info, updated)


        await sam.sendMessage(chatId, { text, preview: { title: 'Contacto de Whatsapp', image } })
            
    }
}