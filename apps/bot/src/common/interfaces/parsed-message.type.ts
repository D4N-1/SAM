import type { typeDevice } from "../types/device.type.js";
import type { interfaceKey } from "./key-message.type.js";

export interface interfaceMessage {
    chatId: string,
    sender: string|undefined,
    senderAlt: string|undefined,
    pushName: string,
    content: string|undefined,
    caption: string|undefined,
    captent: string|undefined,
    botNumber: string|undefined,
    isGroup: boolean,
    contentType: string,
    allMentions: string[]|[],
    mentionedJid: string|undefined,
    video: () => Promise<Buffer|undefined>,
    image: () => Promise<Buffer|undefined>,
    isGif: boolean|undefined,
    isFromMe: boolean,
    quoted: {
        qContent: string|undefined,
        qCaption: string|undefined,
        qCaptent: string|undefined,
        qSender: string|undefined,
        qContentType: any,
        qIsGif: boolean,
        qVideo: () => Promise<Buffer|undefined>,
        qImage: () => Promise<Buffer|undefined>,
    },
    key: interfaceKey,
    timestamp: number,
    platform: string,
    device: typeDevice,
    broadcast: boolean,
    newsletter: boolean
}



