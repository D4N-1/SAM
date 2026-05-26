import type interfaceCommand from "../../common/interfaces/command.interface.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import { downloadImage } from "../../common/utils/image.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";


export default class BotCommand implements interfaceCommand {
    name = 'bot';
    aliases = [];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, captent, botNumber, botName } = message;

        sam.readMessage(key);
        sam.sendPresenceUpdate('composing', chatId);

        const botImageUrl: string = ( await sam.profilePictureUrl(botNumber!) ) || "https://tse2.mm.bing.net/th/id/OIP.guJ4ESMEbUAiUlMVAZ9ZmwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";

        const botImage: Buffer = await downloadImage(botImageUrl);

        const text = `𝗛𝗼𝗹𝗮, 𝘀𝗼𝘆 ${botName}\n\n───────────────\n\n` +
            `[ Inserte texto ]`;

        await sam.send.image(chatId, text, botImage, { canal: true })

    }
}