import type { WASocket } from "@itsukichan/baileys"

export function parseMessage(sam: WASocket, msg: any): any {

    if (!msg[0] || !msg[0]?.messages?.length) return false;

    const message: any = msg[0]?.messages[0]?.message;

    const chatId: string = msg[0]?.id || message?.key?.remoteJid;
    let sender = message?.key?.participant || message?.key?.remoteJid;
    let senderAlt = message?.key?.participantAlt || message?.key?.remoteJidAlt;

    const group = chatId.endsWith('@g.us');

    const isFromMe = message?.key?.fromMe
    const pushName = isFromMe ? sam?.user?.name : message?.pushName
    const botNumber = sam?.user?.id.split(':')[0] + '@s.whatsapp.net';

    if (isFromMe) sender = botNumber;

    return {
        chatId: msg[0]?.id ||
            message?.key?.remoteJid,
        sender,
        senderAlt,
        pushName,
        content: message?.message?.conversation ||
            message?.message?.extendedTextMessage?.text,
        botNumber,
        group,
        fromMe: message?.key?.fromMe,
        key: message?.key,
        timestamp: message?.messageTimestamp,
        platform: message?.platform,
        broadcast: message?.broadcast,
        newsletter: message?.newsletter,

    }


}