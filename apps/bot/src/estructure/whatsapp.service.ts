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


    addMessageOptions(options: interfaceMessageOptions|undefined) {

        const sent: any = {};
        const contextInfo: any = {};

        if (!options) return {};

        const { reply, mentions, canal, footer, gifPlayback } = options;

        if (footer) sent.footer = 'SAM';
        if (gifPlayback) sent.gifPlayback = gifPlayback;

        // Reply
        if (reply?.msg && reply.sender) {
            contextInfo.quotedMessage = reply.msg.message
            contextInfo.stanzaId = reply.msg.key.id
            contextInfo.participant = reply.sender
        }

        // Mentions
        if (mentions && mentions?.length > 0) contextInfo.mentionedJid = mentions

        if (canal) {
          contextInfo.isForwarded = true,
          contextInfo.forwardedNewsletterMessageInfo = {
              newsletterJid: "120363401659366134@newsletter",
              newsletterName: "🜅 𝙎𝘼𝙈 ⤫ ⌯𝘾𝘼𝙉𝘼𝙇",
              serverMessageId: 874
          }
        }

        sent.contextInfo = contextInfo;

        return Object.keys(sent).length ? sent
            : {}
          
    }



    async editMessage(chatId: string, text: string, key: interfaceKey) {
        return this.sock.sendMessage(chatId, { edit: key, text })
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

    async groupFetchAllParticipating() {
        return this.sock.groupFetchAllParticipating()
    }

    async getContact(uid: string) {
        return getContact(uid)
    }

    async getMe() {
        return ( await Api.get('/auth/me') )?.data
    }

}
