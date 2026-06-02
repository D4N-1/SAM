import { generateWAMessageFromContent, proto } from '@itsukichan/baileys';
import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type interfaceKey from "../common/interfaces/key-message.interface.js";
import type { interfaceMessageOptions } from "../common/interfaces/message-options.interface.js";
import { Api } from "../common/utils/api.util.js";


export async function getContact(id: string) {

    if ( id.endsWith('@lid') ) {
        const res = await Api.get(`/contacts/lid/${id.split('@')[0]}`)

        return res?.data

    } else {
        const res = await Api.get(`/contacts/uid/${id.split('@')[0]}`)

        return res?.data
    }
}

export async function count(type: 'communities' | 'groups') {

    return ( await Api.get(`/${type}/all`) )?.data
}

export default class WhatsappService {

    constructor(
        private readonly sock: WASocket
    ) {}

    send = {

        text: async(chatId: string, text: string, options?: interfaceMessageOptions) => {
            return this.sock.sendMessage(chatId, { text, ...this.addMessageOptions(options) })
        },

        image: async(chatId: string, caption: string, image: Buffer, options?: interfaceMessageOptions) => {
            return this.sock.sendMessage(chatId, { image, caption, ...this.addMessageOptions(options) })
        },

        video: async(chatId: string, caption: string, video: Buffer, options?: interfaceMessageOptions) => {
            return this.sock.sendMessage(chatId, { video, caption, ...this.addMessageOptions(options) })
        },

        sticker: async(chatId: string, sticker: Buffer, options?: interfaceMessageOptions) => {
            return this.sock.sendMessage(chatId, { sticker, ...this.addMessageOptions(options) })
        }
    }

    
async dum(chatId: string) {
    // 1. Construimos el contenido del mensaje
    const messageContent = {
        extendedTextMessage: {
            text: "Este es un mensaje con preview",
            contextInfo: {
                externalAdReply: {
                    title: "SAM",
                    body: "Prueba forzada",
                    mediaType: 1,
                    thumbnailUrl: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                    sourceUrl: "https://google.com",
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }
    };

    // 2. Usamos el constructor de proto (esto evita el error de lectura de undefined)
    const finalMessage = {
        message: messageContent
    };

    // 3. Relay directo
    return await this.sock.relayMessage(chatId, finalMessage.message, { 
        messageId: 'SAM' + Date.now() 
    });
}

    /*

{
  "key": {
    "remoteJid": "120363419101925665@g.us",
    "fromMe": true,
    "id": "SUKIB031AC296617FA31"
  },
  "message": {
    "extendedTextMessage": {
      "text": "¡Hola, D4N1! 🗺️\n\nSoy *SAM*, tu bot único. Diseñada para  navegar contigo\n\n¿Quieres ver todas las funciones que tengo desbloqueadas para ti?\n\nHaz clic en los botones de abajo para empezar el recorrido\n\n> *SAM* | ¡Lista para la acción! ⚡",
      "contextInfo": {
        "expiration": "7776000",
        "externalAdReply": {
          "title": "si",
          "body": "Desarrollado para ti",
          "mediaType": "IMAGE",
          "thumbnailUrl": "https://sambot.live/",
          "thumbnail": "/9j/4AAQSkZJRgABAQAAQCjUUWglNleRjOtGb",
          "sourceUrl": "https://sambot.live/",
          "renderLargerThumbnail": true,
          "showAdAttribution": false
        }
      }
    },
    "messageContextInfo": {
      "messageSecret": "03qSbMbLE2FY8SPjRHJKaB34WJDJbMs73brIyTkVO8o="    
    }
  },
  "messageTimestamp": "1780440369",
  "status": "PENDING",
  "participant": "573115548811:94@s.whatsapp.net"
}
  */

/*
{
  "key": {
    "remoteJid": "120363419101925665@g.us",
    "fromMe": false,
    "id": "ACC6AD5CD27825E3F3A9B56AA2A8047D",
    "participant": "159893176774698@lid",
    "participantAlt": "573208201009@s.whatsapp.net"
  },
  "messageTimestamp": 1780440431,
  "pushName": "D4N1",
  "broadcast": false,
  "newsletter": false,
  "platform": "android",
  "message": {
    "extendedTextMessage": {
      "text": "https://sambot.live/",
      "matchedText": "https://sambot.live/",
      "description": "SAM x whatsapp",
      "title": "SAM home",
      "previewType": "NONE",
      "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gqm=",
      "contextInfo": {
        "expiration": 7776000,
        "disappearingMode": {
          "initiator": "CHANGED_IN_CHAT",
          "trigger": "UNKNOWN"
        }
      },
      "thumbnailDirectPath": "/v/t62.36144-24/659240961_2935054390243913_436830592238742242_n.enc?ccb=11-4&oh=01_Q5Aa4gGezxkjE-cDJFErNNuukgU_40ltmpEYCDUhecnYY6Qogw&oe=6A46CC79&_nc_sid=5e03e0",
      "thumbnailSha256": "ylDCI1rJ0+rzALj5bVyNOlL28rkp+vpyELinfIJ0JnU=",
      "thumbnailEncSha256": "A8tIPaYjIVd/a+3vMuNI4FedUMWA2uf4zT6iE2vhnaU=",
      "mediaKey": "GfVOSOUC5xhIO87xRjGxunOrFjXlXYVEiT6G5oCa9Xg=",
      "mediaKeyTimestamp": "1780440430",
      "thumbnailHeight": 573,
      "thumbnailWidth": 1024,
      "inviteLinkGroupTypeV2": "DEFAULT"
    },
    "messageContextInfo": {
      "messageSecret": "L5xF++8g9kcnaDm2ME5kca9qWykOptHAL5OlOn+C9/g="
    }
  }
}

  */

    addMessageOptions(options: interfaceMessageOptions|undefined) {

        const sent: any = {};
        const contextInfo: any = {};

        if (!options) return {};

        const { reply, mentions, canal, gifPlayback, edit, footer, forward, preview } = options;

        if (gifPlayback) sent.gifPlayback = gifPlayback;
        if (edit) sent.edit = edit;
        if (footer) sent.footer = 'SAM'
        

        if (reply?.msg && reply.sender) {
            contextInfo.quotedMessage = reply.msg.message
            contextInfo.stanzaId = reply.msg.key.id
            contextInfo.participant = reply.sender
        }

        if (forward) contextInfo.isForwarded = true
        if (mentions && mentions?.length > 0) contextInfo.mentionedJid = mentions

        if (canal) {
          contextInfo.isForwarded = true,
          contextInfo.forwardedNewsletterMessageInfo = {
              newsletterJid: "120363401659366134@newsletter",
              newsletterName: "🜅 𝙎𝘼𝙈 ⤫ ⌯𝘾𝘼𝙉𝘼𝙇",
              serverMessageId: 874
          }
        }

        if (preview) {

            contextInfo.externalAdReply = {
              mediaType: 1,
              title: 'si',
              body: `Desarrollado para ti`,
              thumbnail: preview,
              thumbnailUrl: 'https://sambot.live/',
              sourceUrl: 'https://sambot.live/',
              showAdAttribution: false,
              renderLargerThumbnail: true,
            }
        }

        sent.contextInfo = contextInfo;

        return Object.keys(sent).length ? sent
            : {}
          
    }


    async readMessage(key: interfaceKey) {
        return this.sock.readMessages([key])
    }

    async sendPresenceUpdate(type: WAPresence, chatId: string) {
        return this.sock.sendPresenceUpdate(type, chatId)
    }

    async onWhatsApp(uid: string) {
        return this.sock?.onWhatsApp(uid)
    }

    async fetchStatus(uid: string) {
        return this.sock.fetchStatus(uid)
    }

    async profilePictureUrl(uid: string) {
        return this.sock.profilePictureUrl(uid)
    }

    async groupMetadata(chatId: string) {
        return this.sock.groupMetadata(chatId)
    }

    /**
     * Obtiene TODOS los grupos donde se encuentra el BOT
     * 
     * ```NO USAR A LA LIGERA```
     * @returns 
     */
    async groupFetchAllParticipating() {
        return this.sock.groupFetchAllParticipating()
    }

    async getContact(uid: string): Promise<{uid: string, name: string }> {
        return getContact(uid)
    }

    async getMe() {
        return ( await Api.get('/auth/me') )?.data
    }

    async countGroups() {
        return count('groups')
    }

    async countCommunities() {
        return count('communities')
    }

}
