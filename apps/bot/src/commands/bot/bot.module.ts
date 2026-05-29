import { enumError } from "../../common/enums/error.enum.js";
import type interfaceCommand from "../../common/interfaces/command.interface.js";
import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import { downloadImage } from "../../common/utils/image.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import { getText } from "./utils/bot.message.js";
import { getTelemtry } from "./utils/bot.telemetry.js";


export default class BotCommand implements interfaceCommand {
    name = 'bot';
    aliases = [];

    async execute(message: interfaceMessage, sam: WhatsappService): Promise<void> {
        
        const { key, chatId, captent, botNumber, botUid, botName } = message;

        sam.readMessage(key);
        sam.sendPresenceUpdate('composing', chatId);

        if (captent?.split(' ')[1] === enumError.ERROR) throw new Error(enumError.INTENTIONAL)

        const contact = await sam.getContact(botNumber!);
        const bot = await sam.getMe();
        const groups = await sam.groupFetchAllParticipating();

        let botImageUrl: string;
        try { botImageUrl = await sam.profilePictureUrl(botNumber!) } catch { botImageUrl = "https://tse2.mm.bing.net/th/id/OIP.guJ4ESMEbUAiUlMVAZ9ZmwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" }

        const botImage: Buffer = await downloadImage(botImageUrl);

        let data: getText = await getTelemtry();

        data.botName = await botName();
        data.uid = botUid!;
        data.groups = Object.keys(groups).length;
        data.role = bot.role;

        const text = await getText(data)

        await sam.send.image(chatId, text, botImage, { canal: true })

    }
}