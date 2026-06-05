import type typeDevice from "../types/device.type.js";
import type interfaceKey from "./key-message.interface.js";

export default interface interfaceMessage {
    chatId: string,
    sender: string|undefined,
    senderAlt: string|undefined,
    pushName: string,
    content: string|undefined,
    caption: string|undefined,
    buttonContent: string|undefined,
    buttonDisplay: string|undefined,
    captent: string|undefined,
    botNumber: string|undefined,
    botUid: string|undefined,
    botName: () => Promise<string>,
    isGroup: boolean,
    isPrivate: boolean,
    contentType: string,
    allMentions: string[]|[],
    mentionedJid: string|undefined,
    video: () => Promise<Buffer|undefined>,
    image: () => Promise<Buffer|undefined>,
    sticker: () => Promise<Buffer|undefined>,
    isAnimated: boolean | undefined,
    isGif: boolean|undefined,
    isFromMe: boolean,
    quoted: {
        qContent: string|undefined,
        qCaption: string|undefined,
        qCaptent: string|undefined,
        qSender: string|undefined,
        qContentType: any,
        qIsGif: boolean|undefined,
        qVideo: () => Promise<Buffer|undefined>,
        qImage: () => Promise<Buffer|undefined>,
        qSticker: () => Promise<Buffer|undefined>,
        qIsAnimated: boolean|undefined,
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



