import { downloadContentFromMessage, getContentType, getDevice } from "@itsliaaa/baileys"
import type interfaceKey from "../common/interfaces/key-message.interface.js";
import type interfaceMessage from "../common/interfaces/parsed-message.interface.js";
import axios from "axios";
import Logger from "../common/utils/logger.util.js";
import type typeDevice from "../common/types/device.type.js";
import { enumMessage } from "../common/enums/type-mesage.enum.js";
import enumContext from "../common/enums/context.enum.js";
import { getContact } from "./whatsapp.service.js";

const parseUid = (uid: string|undefined) => {

    if (!uid) return undefined;
    if (!uid.includes(':')) return uid
    const arrUid = uid.split(':');

    return arrUid[0] + ( uid.endsWith('lid') ? '@lid' : '@s.whatsapp.net' )
}


type Type = enumMessage.videoMessage | enumMessage.imageMessage |
    enumMessage.stickerMessage | enumMessage.documentMessage |
    enumMessage.audioMessage | enumMessage.documentWithCaptionMessage
const downloadMedia = async(msg: any, type: Type) => {

    try {

        console.log('\n\nDOWNLOADING')
        console.log(JSON.stringify( msg,null,2 ) )

        const mediaType = type === enumMessage.imageMessage ? 'image' :
            type === enumMessage.stickerMessage ? 'sticker' :
            type === enumMessage.videoMessage ? 'video' :
            type === enumMessage.audioMessage ? 'audio' :
            type === enumMessage.documentMessage ? 'document' :
            type === enumMessage.documentWithCaptionMessage ? 'document' :
            undefined;

        if (!mediaType) return;
        const mediaMessage = msg?.message?.[`${mediaType}Message`] ||
            msg?.message?.ephemeralMessage?.msg?.[`${mediaType}Message`] ||
            msg?.message?.documentWithCaptionMessage?.message?.documentMessage;

        if (mediaMessage?.mediaKey) {

            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            let chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);

        } else {

            const baseUrl = 'https://mmg.whatsapp.net';

            const directPath = mediaMessage?.directPath?.startsWith('/') ?
                mediaMessage.directPath :
                `/${mediaMessage.directPath}`;

            const url = mediaMessage?.url ? mediaMessage?.url : `${baseUrl}${directPath}`;

            const res = await axios.get(url, {
                responseType: "arraybuffer",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            return Buffer.from(res.data);
        }

    } catch (error) {
        console.error(error)
        Logger.log(enumContext.MessageParser, 'Descargar la media del mensaje')
    }
}



export function parseMessage(sock: any, msg: any): interfaceMessage|null|undefined {
    try {
        if (!msg || !msg.message) return null;

        
        //console.log( JSON.stringify(msg,null,2) )

        
        const chatId: string = msg.key?.remoteJid || '';
        let sender: string | undefined = parseUid(msg.key?.participant || msg.key?.remoteJid);
        let senderAlt: string | undefined = parseUid(msg.key?.participantAlt || msg.key?.remoteJidAlt);

        const isFromMe: boolean = !!msg.key?.fromMe;
        const pushName: string = isFromMe ? sock?.user?.name : msg.pushName;

        const actualMessage = msg.message?.ephemeralMessage?.msg || msg.message;

        const content: string | undefined = actualMessage?.conversation ||
            actualMessage?.extendedTextMessage?.text;

        const caption: string | undefined = actualMessage?.imageMessage?.caption || 
            actualMessage?.videoMessage?.caption ||
            actualMessage?.documentMessage?.caption;

        const fileName: string | undefined = actualMessage?.documentMessage?.fileName;

        const buttonContent: string | undefined = actualMessage?.templateButtonReplyMessage?.selectedId
        const buttonDisplay: string | undefined = actualMessage?.templateButtonReplyMessage?.selectedDisplayText


        const botNumber: string|undefined = parseUid(sock.user!.id);
        const botUid: string|undefined = botNumber?.split('@')[0]
        const botName = async(): Promise<string> => (await getContact(botUid!))?.name;

        const isGroup: boolean = chatId.endsWith('@g.us');
        const isPrivate: boolean = chatId.endsWith('@s.whatsapp.net') || chatId.endsWith('@lid')

        const contentType: enumMessage = getContentType(msg.message) as enumMessage;

        const allMentions: string[] = actualMessage?.extendedTextMessage?.contextInfo?.mentionedJid ||
            actualMessage?.imageMessage?.contextInfo?.mentionedJid || 
            actualMessage?.videoMessage?.contextInfo?.mentionedJid || [];

        const mentionedJid: string | undefined = allMentions[0];

        const isGif: boolean | undefined = actualMessage?.videoMessage?.gifPlayback;
        const isAnimated: boolean | undefined = actualMessage?.stickerMessage?.isAnimated;
        const ptt: boolean | undefined = actualMessage?.audioMessage?.ptt;

        if (isFromMe && botNumber) sender = botNumber;


        const key: interfaceKey = msg.key;
        const timestamp: number = msg.messageTimestamp;
        const timestampDate: string = new Date(timestamp * 1_000).toLocaleString("es-CO", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).replace(/\//g, "/");

        const platform: string = msg.platform;
        const device: typeDevice = getDevice(key.id || '');
        const broadcast: boolean = !!msg.broadcast;
        const newsletter: boolean = isGroup ? false : chatId.endsWith('@newsletter');

        const quotedMessage = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        const qContent: string|undefined = quotedMessage?.extendedTextMessage?.text ||
            msg.message?.videoMessage?.contextInfo?.quotedMessage?.conversation ||
            msg.message?.imageMessage?.contextInfo?.quotedMessage?.conversation ||
            quotedMessage?.ephemeralMessage?.message?.extendedTextMessage?.text ||
            msg.message?.videoMessage?.contextInfo?.quotedMessage?.conversation ||
            quotedMessage?.conversation ||
            msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text?.conversation ||
            msg.message?.imageMessage?.contextInfo?.quotedMessage?.conversation;

        const qCaption: string|undefined = quotedMessage?.videoMessage?.caption ||
            quotedMessage?.imageMessage?.caption ||
            quotedMessage?.documentMessage?.caption ||
            quotedMessage?.documentWithCaptionMessage?.message?.documentMessage?.caption;

        const qSender: string|undefined = parseUid( msg.message?.videoMessage?.contextInfo?.participant ||
            msg.message?.imageMessage?.contextInfo?.participant ||
            msg.message?.extendedTextMessage?.contextInfo?.participant ||
            msg.message?.imageMessage?.contextInfo?.participants || 
            msg.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.participant );

        const qContentType: enumMessage = getContentType(quotedMessage) as enumMessage;
        const qIsGif: boolean | undefined = quotedMessage?.videoMessage?.gifPlayback;
        const qIsAnimated: boolean | undefined = quotedMessage?.stickerMessage?.isAnimated;
        const qMimetype: string | undefined = quotedMessage?.documentMessage?.mimetype ||
            quotedMessage?.documentWithCaptionMessage?.message?.documentMessage?.mimetype;
        const qFileName: string | undefined = quotedMessage?.documentMessage?.fileName ||
            quotedMessage?.documentMessage?.caption ||
            quotedMessage?.documentWithCaptionMessage?.message?.documentMessage?.fileName ||
            quotedMessage?.documentWithCaptionMessage?.message?.documentMessage?.caption;
        const qPtt: boolean | undefined = quotedMessage?.audioMessage?.ptt;


        const fakeQuotedMessage = quotedMessage ? { message: quotedMessage } : null;

        return {
            chatId,
            sender,
            senderAlt,
            pushName,
            content,
            caption,
            fileName,
            buttonContent,
            buttonDisplay,
            captent: content ?? caption ?? buttonContent,
            botNumber,
            botUid,
            botName,
            isGroup,
            isPrivate,
            contentType,
            allMentions,
            mentionedJid,
            isGif,
            ptt,
            isFromMe,
            quoted: {
                qContent,
                qCaption,
                qCaptent: qContent ?? qCaption,
                qSender,
                qContentType,
                qIsGif,
                qVideo: qContentType === enumMessage.videoMessage ? () => downloadMedia(fakeQuotedMessage, qContentType) :
                    async () => undefined,
                qImage: qContentType === enumMessage.imageMessage ? () => downloadMedia(fakeQuotedMessage, qContentType) :
                    async () => undefined,
                qAudio: qContentType === enumMessage.audioMessage ? () => downloadMedia(fakeQuotedMessage, qContentType) :
                    async () => undefined,
                qPtt,
                qSticker: qContentType === enumMessage.stickerMessage ? () => downloadMedia(fakeQuotedMessage, qContentType) :
                    async () => undefined,
                qIsAnimated,
                qDocument: qContentType === enumMessage.documentMessage || qContentType === enumMessage.documentWithCaptionMessage ? () => downloadMedia(fakeQuotedMessage, qContentType) :
                    async () => undefined,
                qMimetype,
                qFileName
            },
            key,
            timestamp,
            timestampDate,
            platform,
            device,
            broadcast,
            newsletter,
            video: contentType === enumMessage.videoMessage ? () => downloadMedia(msg, contentType) :
                async () => undefined,
            image: contentType === enumMessage.imageMessage ? () => downloadMedia(msg, contentType) :
                async () => undefined,
            audio: contentType === enumMessage.audioMessage ? () => downloadMedia(msg, contentType) :
                async () => undefined,
            sticker: contentType === enumMessage.stickerMessage ? () => downloadMedia(msg, contentType) :
                async () => undefined,
            isAnimated,
            document: contentType === enumMessage.documentMessage ? () => downloadMedia(msg, contentType) :
                async() => undefined,
            msg
        };
    } catch (error) {
        Logger.error(enumContext.MessageParser, 'Crear ParsedMessage')
    }
}

function async(): string {
    throw new Error("Function not implemented.");
}
