import type interfaceMessage from "../../common/interfaces/parsed-message.interface.js";
import { downloadImage } from "../../common/utils/image.util.js";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import { getPresentationText, type interfacePresentation } from "./utils/bot-presentation.message.js";
import { getTelemetryText } from "./utils/bot-telemetry.message.js";
import type { interfaceTelemetry } from "./utils/bot-telemetry.message.js";
import { getTelemtry } from "./utils/bot.telemetry.js";


export async function telemetryCommand(message: interfaceMessage, sam: WhatsappService) {

    let { chatId, botNumber, botUid, botName } = message;

    const bot = await sam.getMe();
    const groups = await sam.countGroups();
    const communities = await sam.countCommunities();

    let botImageUrl: string;
    try { botImageUrl = await sam.profilePictureUrl(botNumber!) } catch { botImageUrl = "https://tse2.mm.bing.net/th/id/OIP.guJ4ESMEbUAiUlMVAZ9ZmwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" }

    const botImage: Buffer = await downloadImage(botImageUrl);

    let data: interfaceTelemetry = await getTelemtry();

    data.botName = await botName();
    data.uid = botUid!;
    data.groups = groups;
    data.communities = communities;
    data.role = bot.role;

    const text = await getTelemetryText(data)

    await sam.send.image(chatId, text, botImage, { canal: true })

}


export async function presentationCommand(message: interfaceMessage, sam: WhatsappService) {

    const { chatId, botNumber, botName, sender, senderAlt } = message;

    const user = senderAlt || sender;

    const contact = await sam.getContact(user!);

    let botImageUrl: string;
    try { botImageUrl = await sam.profilePictureUrl(botNumber!) } catch { botImageUrl = 'https://tse2.mm.bing.net/th/id/OIP.guJ4ESMEbUAiUlMVAZ9ZmwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' }

    const botImage = await downloadImage(botImageUrl);

    const presentation: interfacePresentation = {
        botName: await botName(),
        name: contact.name
    }

    const text = await getPresentationText(presentation)

    await sam.send.text(chatId, text, { canal: true, footer: true, forward: true, preview: botImage })
}