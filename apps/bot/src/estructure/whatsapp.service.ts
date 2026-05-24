import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type { interfaceKey } from "../common/interfaces/key-message.type.js";

export class WhatsappService {

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

        video: async(chatId: string, caption: string, video: Buffer) => {
            return this.sam.sendMessage(chatId, { video, caption })
        }
    }


    async editMessage(chatId: string, text: string, key: any) {
        return this.sam.sendMessage(chatId, { edit: key, text })
    }

    async readMessage(key: interfaceKey) {
        return this.sam.readMessages([key])
    }

    sendPresenceUpdate(type: WAPresence, chatId: string) {
        return this.sam.sendPresenceUpdate(type, chatId)
    }
}