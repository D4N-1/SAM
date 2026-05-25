import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type interfaceKey from "../common/interfaces/key-message.type.js";

export default class WhatsappService {

    constructor(
        private readonly sam: WASocket
    ) {}

    send = {

        text: async(chatId: string, text: string) => {
            return this.sam.sendMessage(chatId, { text })
        },

        image: async(chatId: string, caption: string, image: Buffer) => {
            return this.sam.sendMessage(chatId, { image, caption })
        },

        video: async(chatId: string, caption: string, video: Buffer, gifPlayback?: boolean) => {
            return this.sam.sendMessage(chatId, { video, caption, gifPlayback: gifPlayback || false })
        },

        sticker: async(chatId: string, sticker: Buffer) => {
            return this.sam.sendMessage(chatId, { sticker })
        }
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