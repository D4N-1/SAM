export interface ParsedMessage {
    chatId: string,
    sender: string,
    senderAlt: string,
    pushName: string,
    content: string,
    botNumber: string,
    group: boolean,
    key: {
      remoteJid: string,
      remoteJidAlt: string,
      fromMe: boolean,
      id: string,
      participant: string,
      participantAlt: string
    },
    fromMe: boolean,
    timestamp: number,
    platform: string,
    broadcast: boolean,
    newsletter: boolean
}