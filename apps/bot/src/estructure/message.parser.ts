    import { downloadContentFromMessage, getContentType, getDevice, type WASocket } from "@itsukichan/baileys"
    import type { interfaceKey } from "../common/types/key-message.type.js";
    import type { interfaceMessage } from "../common/types/parsed-message.type.js";
    import axios from "axios";
    import { Logger } from "../common/utils/logger.util.js";
    import type { typeDevice } from "../common/types/device.type.js";

    const parseUid = (uid: string|undefined) => {

        if (!uid) return undefined;
        if (!uid.includes(':')) return uid
        const arrUid = uid.split(':');

        return arrUid[0] + ( uid.endsWith('lid') ? '@lid' : '@s.whatsapp.net' )
    }


    const downloadMedia = async(msg: any, type: 'videoMessage'|'imageMessage') => {


        try {

            const mediaType = type === 'imageMessage' ? 'image' : 'video';
            const mediaMessage = msg?.message?.[`${mediaType}Message`] || msg?.message?.ephemeralMessage?.msg?.[`${mediaType}Message`];

            if (mediaMessage?.mediaKey) {

                const stream = await downloadContentFromMessage(mediaMessage, mediaType);
                let chunks = [];

                for await (const chunk of stream) {
                chunks.push(chunk);
                }

                return Buffer.concat(chunks);

            } else {

                const url = mediaMessage?.url ?
                    mediaMessage?.url :
                    "https://mmg.whatsapp.net" + mediaMessage?.directPath;

                const res = await axios.get(url, { responseType: "arraybuffer" });
                return Buffer.from(res.data);
            }

        } catch (error) {
            Logger('MessageParser', 'Descargar la media del mensaje', null, true)
        }
    }


    export function parseMessage(sam: WASocket, msg: any): interfaceMessage | null {
        if (!msg || !msg.message) return null;

        const chatId: string = msg.key?.remoteJid || '';
        let sender: string | undefined = parseUid(msg.key?.participant || msg.key?.remoteJid);
        let senderAlt: string | undefined = parseUid(msg.key?.participantAlt || msg.key?.remoteJidAlt);

        const isFromMe: boolean = !!msg.key?.fromMe;
        const pushName: string = isFromMe ? (sam?.user?.name || 'Bot') : msg.pushName;

        const actualMessage = msg.message?.ephemeralMessage?.msg || msg.message;

        const content: string | undefined = actualMessage?.conversation ||
            actualMessage?.extendedTextMessage?.text;
            
        const caption: string | undefined = actualMessage?.imageMessage?.caption || 
            actualMessage?.videoMessage?.caption;

        const botNumber: string | undefined = sam?.user?.id ? parseUid(sam.user.id) : undefined;
        const isGroup: boolean = chatId.endsWith('@g.us');

        const typeMessage: string = getContentType(msg.message) as string;
        
        const allMentions: string[] = actualMessage?.extendedTextMessage?.contextInfo?.mentionedJid ||
            actualMessage?.imageMessage?.contextInfo?.mentionedJid || 
            actualMessage?.videoMessage?.contextInfo?.mentionedJid || [];
            
        const mentionedJid: string | undefined = allMentions[0];

        const isGif: boolean | undefined = actualMessage?.videoMessage?.gifPlayback;

        if (isFromMe && botNumber) sender = botNumber;

        const key: interfaceKey = msg.key;
        const timestamp: number = msg.messageTimestamp;
        const platform: string = msg.platform;
        const device: typeDevice = getDevice(key.id || '');
        const broadcast: boolean = !!msg.broadcast;
        const newsletter: boolean = isGroup ? false : chatId.endsWith('@newsletter');

        return {
            chatId,
            sender,
            senderAlt,
            pushName,
            content,
            caption,
            captent: content ?? caption,
            botNumber,
            isGroup,
            typeMessage,
            allMentions,
            mentionedJid,
            isGif,
            isFromMe,
            key,
            timestamp,
            platform,
            device,
            broadcast,
            newsletter,
            video: typeMessage === 'imageMessage' ?
                () => downloadMedia(msg, typeMessage) :
                async () => undefined,
            image: typeMessage === 'videoMessage' ?
                () => downloadMedia(msg, typeMessage) :
                async () => undefined
        };
    }