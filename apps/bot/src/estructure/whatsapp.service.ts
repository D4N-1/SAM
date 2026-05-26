import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type interfaceKey from "../common/interfaces/key-message.interface.js";
import type { interfaceMessageOptions } from "../common/interfaces/message-options.interface.js";

export default class WhatsappService {

    constructor(
        private readonly sam: WASocket
    ) {}

    send = {

        text: async(chatId: string, text: string, options?: interfaceMessageOptions) => {
            return this.sam.sendMessage(chatId, { text, ...this.addMessageOptions(options) })
        },

        image: async(chatId: string, caption: string, image: Buffer, options?: interfaceMessageOptions) => {
            return this.sam.sendMessage(chatId, { image, caption, ...this.addMessageOptions(options) })
        },

        video: async(chatId: string, caption: string, video: Buffer, options?: interfaceMessageOptions) => {
            return this.sam.sendMessage(chatId, { video, caption, ...this.addMessageOptions(options) })
        },

        sticker: async(chatId: string, sticker: Buffer, options?: interfaceMessageOptions) => {
            return this.sam.sendMessage(chatId, { sticker, ...this.addMessageOptions(options) })
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



    async editMessage(chatId: string, text: string, key: any) {
        return this.sam.sendMessage(chatId, { edit: key, text })
    }

    async readMessage(key: interfaceKey) {
        return this.sam.readMessages([key])
    }

    async sendPresenceUpdate(type: WAPresence, chatId: string) {
        return this.sam.sendPresenceUpdate(type, chatId)
    }

    async onWhatsApp(uid: string) {
        return this.sam.onWhatsApp(uid)
    }

    async fetchStatus(uid: string) {
        return this.sam.fetchStatus(uid)
    }

    async profilePictureUrl(uid: string) {
        return this.sam.profilePictureUrl(uid)
    }
}