import * as qrcode from "qrcode"
import { Boom } from "@hapi/boom";
import type { WASocket, BaileysEventMap } from "@itsukichan/baileys"
import { deleteAuth } from "./whatsapp.auth.js"
import { startWhatsappBot } from "./whatsapp.client.js"
import { enumStatusConnection } from "../common/enums/enum.status.js"
import { msgSTATUS_TITLE, msgSTATUS_CONNECTION } from "../common/messages/log-status.message.js"
import { parseMessage } from "../messages/msg.parser.js"
import type { ParsedMessage } from "../messages/msg.types.js"
import { parseCommand } from "../commands/command.parser.js"
import { routeCommand } from "../commands/command.router.js"
import { wait } from "../common/utils/function.util.js"


export async function registerConnectionEvent(sam: WASocket) {
    
    sam.ev.on("connection.update", async (data: BaileysEventMap['connection.update']) => {

        let { connection, qr, lastDisconnect } = data

        console.log(data)

        if (qr) return console.log( await qrcode.toString(qr, { type: "terminal", small: true }) )

        if (connection) {
            console.log(msgSTATUS_TITLE)
            console.log(msgSTATUS_CONNECTION[connection] + '\n')
        }

        if (!sam.authState.creds.registered && connection === enumStatusConnection.CONNECTING) {

            await wait(2_000)

            const number = '573134359055'

            console.log(`Solicitando codigo de emparejamiento a WhatsApp...`)

            const reqCode = undefined;
            const code = await sam.requestPairingCode(number, reqCode)

            console.log(`CODIGO DE EMPAREJAMIENTO: ${code}`)
        }

        if (connection === enumStatusConnection.CLOSE) {

            const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;


            if (reason == 401) {
                await deleteAuth()
                process.exit(0)
            }

            await wait(2_500)
            startWhatsappBot()
        }

        if (connection === enumStatusConnection.OPEN) {

            
        }
    })

}

export function registerCredsEvents(sam: WASocket, saveCreds: any) {

    sam.ev.on("creds.update", saveCreds);

}




const max_age = 60_000;


export function registerMessagesEvent(sam: WASocket) {

    sam.ev.on("chats.update", async (data: BaileysEventMap['chats.update']) => {

        for (const msg of data) {

            console.log("\nDATA")
            console.log(JSON.stringify(msg,null,2))

            const timestamp = ( Number( msg.conversationTimestamp) ?? 0) * 1_000;
            const now = Date.now();

            if (now - timestamp > max_age) {
                console.log('MENSAJE VIEJO')
                return
            }

            
            let message: ParsedMessage = parseMessage(sam, data)
            if (!message) return;

            //if (message.chatId == "159893176774698@lid") {
                console.log("\nMESSAGE")
                console.log(message)
            //}

            let parsedCommand = parseCommand(message.content);
            if (!parsedCommand) return;

            routeCommand( parsedCommand, sam, message )

        }
    })
}