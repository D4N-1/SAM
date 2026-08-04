import type typeDevice from "../types/device.type.js";
import type { interfaceContact } from "./contact.interface.ts";
import type interfaceKey from "./key-message.interface.js";

export default interface interfaceMessage {
    chatId: string,
    sender: string|null,
    senderAlt: string|null,
    username: string|null,
    pushName: string,
    content: string|undefined,
    caption: string|undefined,
    fileName: string|undefined,
    buttonContent: string|undefined,
    buttonDisplay: string|undefined,
    captent: string|undefined,
    bot: () => Promise<interfaceContact>
    botNumber: string|null,
    botUid: string|undefined,
    botName: () => Promise<string>,
    isGroup: boolean,
    isPrivate: boolean,
    contentType: string,
    allMentions: string[]|[],
    mentionedJid: string|undefined,
    video: () => Promise<Buffer|undefined>,
    image: () => Promise<Buffer|undefined>,
    audio: () => Promise<Buffer|undefined>,
    sticker: () => Promise<Buffer|undefined>,
    isAnimated: boolean | undefined,
    document: () => Promise<Buffer|undefined>,
    isGif: boolean|undefined,
    ptt: boolean|undefined,
    isFromMe: boolean,
    quoted: {
        qContent: string|undefined,
        qCaption: string|undefined,
        qCaptent: string|undefined,
        qSender: string|null,
        qContentType: any,
        qIsGif: boolean|undefined,
        qVideo: () => Promise<Buffer|undefined>,
        qImage: () => Promise<Buffer|undefined>,
        qAudio: () => Promise<Buffer|undefined>,
        qPtt: boolean|undefined,
        qSticker: () => Promise<Buffer|undefined>,
        qIsAnimated: boolean|undefined,
        qDocument: () => Promise<Buffer|undefined>,
        qMimetype: string|undefined,
        qFileName: string|undefined
    },
    key: interfaceKey,
    timestamp: number,
    timestampDate: string,
    platform: string,
    device: typeDevice,
    broadcast: boolean,
    newsletter: boolean,
    msg: any
}



