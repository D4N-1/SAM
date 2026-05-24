import type { typeDevice } from "./device.type.js";
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
    typeMessage: string,
    allMentions: string[]|[],
    mentionedJid: string|undefined,
    video: () => Promise<Buffer|undefined>,
    image: () => Promise<Buffer|undefined>,
    isGif: boolean|undefined,
    isFromMe: boolean,
    key: interfaceKey,
    timestamp: number,
    platform: string,
    device: typeDevice,
    broadcast: boolean,
    newsletter: boolean
}



