import * as qrcode from "qrcode"
import { Boom } from "@hapi/boom";
import type { WASocket, BaileysEventMap } from "@itsukichan/baileys"
import { deleteAuth } from "./whatsapp.auth.js"
import { startWhatsappBot } from "./whatsapp.client.js"
import { enumStatusConnection } from "../common/enums/enum.status.js"
import { msgSTATUS_TITLE, msgSTATUS_CONNECTION } from "../common/messages/log-status.message.js"
import { parseMessage } from "./whatsapp.parser.js"
import type { interfaceMessage } from "../common/interfaces/parsed-message.type.js";
import { wait } from "../common/utils/function.util.js"
import { CommandRouter } from "../commands/command.router.js";


const commandRouter = new CommandRouter();
commandRouter.registerCommands();
const max_age = 60_000;

export async function registerConnectionEvent(sam: WASocket) {
    
    sam.ev.on("connection.update", async (data: BaileysEventMap['connection.update']) => {

        let { connection, qr, lastDisconnect } = data


        if (qr) return console.log( await qrcode.toString(qr, { type: "terminal", small: true }) )

        if (connection) {
            console.log("\n" + msgSTATUS_TITLE)
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


export function registerMessagesEvent(sam: WASocket) {

    sam.ev.on("messages.upsert", async (data: BaileysEventMap['messages.upsert']) => {
        
        if (!data.messages || data.messages.length === 0) return;

        for (const msg of data.messages) {
            if (!msg.key) continue;

            const timestamp = (Number(msg.messageTimestamp) ?? 0) * 1_000;
            const now = Date.now();

            if (now - timestamp > max_age) {
                console.log('MENSAJE VIEJO IGNORADO');
                continue;
            }

            let parsedMessage: interfaceMessage | null = parseMessage(sam, msg);
            if (!parsedMessage) continue;

            console.log(parsedMessage)
            await commandRouter.handler(sam, parsedMessage);
        }
    });
}