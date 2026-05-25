import type interfaceCommand from "../../common/interfaces/command.type.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.type.js";
import Logger from "../../common/utils/logger.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import { translate } from "google-translate-api-x";
import { msgERROR } from "./utils/error.message.js";



export default class TraductorCommand implements interfaceCommand {
    name = 'traductor';
    aliases = [ 'traducir',
        'english', 'ingles', 'eng',
        'spanish', 'español', 'esp'
    ];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { captent, chatId, key, quoted } = message;
        try {

            await sam.readMessage(key);
            await sam.sendPresenceUpdate('composing', chatId);

            if (captent?.split(' ')[1] === '-error') throw new Error('INTENCIONAL')

            if ( captent?.startsWith('!traducir') || captent?.startsWith('!traductor') ) return await sam.send.text(chatId, '🌐 𝗨𝘀𝗮 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝗰𝗼𝗻 𝗲𝗹 𝗶𝗱𝗶𝗼𝗺𝗮 𝗮𝗹 𝗰𝘂𝗮𝗹 𝗱𝗲𝘀𝗲𝗮𝘀 𝘁𝗿𝗮𝗱𝘂𝗰𝗶𝗿\n\n> ☉ \`!english\` hola')

            const origin = quoted.qCaptent || captent?.split(' ').slice(1).join(' ').trim();
            if ( !origin ) return await sam.send.text(chatId, `🌐 𝗧𝗲 𝗳𝗮𝗹𝘁𝗮 𝗲𝗹 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗾𝘂𝗲 𝗱𝗲𝘀𝗲𝗮𝘀 𝗾𝘂𝗲 𝘁𝗿𝗮𝗱𝘂𝘇𝗰𝗮\n\n> ☉ \`${captent?.split(' ')[0]}\` hola`)

            const leng = captent?.slice(1).split(' ')[0]
            const to = [ 'english', 'ingles' ].includes(leng!) ? 'en' :
                [ 'spanish', 'español' ].includes(leng!) ? 'es' :
                undefined;
            if (!to) return;

            const translated = await translate(origin, { to })

            const text = `🌐 𝗧𝗿𝗮𝗱𝘂𝗰𝗰𝗶𝗼𝗻 𝗮𝗹 *${leng}*\n\n${translated.text}`

            return await sam.send.text(chatId, text)

        } catch (error: any) {
            if (error.message !== 'INTENCIONAL') {
                Logger('sayModule', 'Error interno', null, true)
                console.error(error)
            }
            sam.send.text(chatId, msgERROR())
        }

    }
}