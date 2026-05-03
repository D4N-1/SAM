import * as qrcode from "qrcode"
import type { WASocket, BaileysEventMap } from "@itsukichan/baileys"
import { deleteAuth } from "./whatsapp.auth.js"
import { startWhatsappBot } from "./whatsapp.client.js"
import { enumStatusConnection } from "../../shared/enums/enum.status.js"
import { msgSTATUS_TITLE, msgSTATUS_CONNECTION } from "../../shared/messages/log-status.message.js"
import { parseMessage } from "../../modules/messages/msg.parser.js"
import type { ParsedMessage } from "../../modules/messages/msg.types.js"
import { parseCommand } from "../../commands/command.parser.js"
import { routeCommand } from "../../commands/command.router.js"

export function registerConnectionEvent(sam: WASocket) {
    
    sam.ev.on("connection.update", async (data: BaileysEventMap['connection.update']) => {

        let { connection, qr, lastDisconnect } = data as { connection?: enumStatusConnection, qr?: string, lastDisconnect: any }

        if (qr) return console.log( await qrcode.toString(qr, { type: "terminal", small: true }) )

        if (connection) {
            console.log(msgSTATUS_TITLE)
            console.log(msgSTATUS_CONNECTION[connection])
            console.log('\n')
        }

        if (connection === enumStatusConnection.CLOSE) {

            const reason = lastDisconnect?.error?.output?.statusCode;

            if (reason == 401) {
                await deleteAuth()
                process.exit(0)
            }

            startWhatsappBot()
        }

        if (connection === enumStatusConnection.OPEN) {
        }
    })

}

export function registerCredsEvents(sam: WASocket, saveCreds: any) {

    sam.ev.on("creds.update", saveCreds);

}

export function registerMessagesEvent(sam: WASocket) {

    sam.ev.on("chats.update", async (data: BaileysEventMap['chats.update']) => {

        console.log("\nDATA")
        console.log(JSON.stringify(data,null,2))
        
        let message: ParsedMessage = parseMessage(sam, data)
        if (!message) return;

        if (message.chatId == "159893176774698@lid") {
            console.log("\nMESSAGE")
            console.log(message)
        }

        let res = parseCommand(message.content);
        if (!res) return

        routeCommand( res, sam, message )

    })
}