import type { WASocket } from "@itsukichan/baileys"

export function parseMessage(sam: WASocket, msg: any): any {

    const message: any = msg[0]?.messages[0]?.message;

    console.log(message)

    let sender = message?.key?.participant
    
    let senderAlt = message?.key?.participantAlt

    const group = sender == undefined && senderAlt == undefined ? false : true

    sender = group ? sender : message?.key?.remoteJid
    senderAlt = group ? senderAlt : message?.key?.remoteJidAlt

    return {
        chatId: msg[0]?.id ||
            message?.key?.remoteJid,
        sender,
        senderAlt,
        pushName: message?.pushName,
        content: message?.message?.conversation ||
            message?.message?.extendedTextMessage?.text,
        botNumber: sam?.user?.id.split(':')[0] + '@s.whatsapp.net',
        group,
        fromMe: message?.key?.fromMe,
        key: message?.key,
        timestamp: message?.messageTimestamp,
        platform: message?.platform,
        broadcast: message?.broadcast,
        newsletter: message?.newsletter,

    }


}