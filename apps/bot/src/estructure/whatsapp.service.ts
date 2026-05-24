import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type { interKey } from "../common/types/parsed-message.type.js";

export class WhatsappService {

    constructor(
        private readonly sam: WASocket
    ) {}

    send = {

        text: async(chatId: string, text: string) => {
            return this.sam.sendMessage(chatId, { text })
        }
    }


    async editMessage(chatId: string, text: string, key: any) {
        return this.sam.sendMessage(chatId, { edit: key, text })
    }

    async readMessage(key: interKey) {
        return this.sam.readMessages([key])
    }

    sendPresenceUpdate(type: WAPresence, chatId: string) {
        return this.sam.sendPresenceUpdate(type, chatId)
    }
}