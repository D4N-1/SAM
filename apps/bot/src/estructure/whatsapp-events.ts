import * as qrcode from "qrcode"
import { Boom } from "@hapi/boom";
import { type WASocket, type BaileysEventMap } from "@itsukichan/baileys"
import { deleteAuth } from "./utils/whatsapp-auth.util.js"
import { startWhatsappBot } from "./whatsapp-client.js"
import { enumStatusConnection } from "../common/enums/enum.status.js"
import { msgSTATUS_TITLE, msgSTATUS_CONNECTION } from "../common/messages/log-status.message.js"
import { parseMessage } from "./whatsapp.parser.js"
import type interfaceMessage from "../common/interfaces/parsed-message.interface.js";
import { wait } from "../common/utils/function.util.js"
import commandRouter from "../commands/command.router.js";
import { enumMessage } from "../common/enums/type-mesage.enum.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";


const max_age = 60_000;

export async function registerConnectionEvent(uid: string, code: string, sam: WASocket) {

    try {
    
        sam.ev.on("connection.update", async (data: BaileysEventMap['connection.update']) => {

            let { connection, qr, lastDisconnect } = data

            console.log(data)
            if (qr) console.log( await qrcode.toString(qr, { type: "terminal", small: true }) )

            if (connection) {
                console.log("\n" + msgSTATUS_TITLE)
                console.log(msgSTATUS_CONNECTION[connection] + '\n')
            }

            if (!sam.authState.creds.registered && connection === enumStatusConnection.CONNECTING) {

                await wait(4_000)

                console.log(`Solicitando codigo de emparejamiento a WhatsApp...`)


                await sam.requestPairingCode(uid, code)

                console.log(`CODIGO DE EMPAREJAMIENTO: ${code}`)
            }

            if (connection === enumStatusConnection.CLOSE) {

                const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
                console.log(reason)

                if (reason == 401) await deleteAuth(uid)

                Logger.error('WhatsappEvents', `Reintentando conexión en 5 segundos...`)
                await wait(5_000);
                startWhatsappBot(uid, code);
            }

            if (connection === enumStatusConnection.OPEN) Logger.log(enumContext.WhatsappEvents, 'SAM en ACTIVO')
        })

    } catch (error) {
        Logger.error(enumContext.WhatsappEvents, 'Connection Update')
    }

}

export function registerCredsEvents(sam: WASocket, saveCreds: any) {

    sam.ev.on("creds.update", saveCreds);

}


export function registerMessagesEvent(samSocket: WASocket) {

    try {

        samSocket.ev.on("messages.upsert", async (data: BaileysEventMap['messages.upsert']) => {

            if (!data.messages || data.messages.length === 0) return;

            for (const msg of data.messages) {
                if (!msg.key) continue;

                //console.log('[] - NEW MESSAGE')
                //console.log(JSON.stringify(msg,null,2))
                const timestamp = (Number(msg.messageTimestamp) ?? 0) * 1_000;
                const now = Date.now();

                if (now - timestamp > max_age) {
                    console.log('MENSAJE VIEJO IGNORADO');
                    continue;
                }

                let parsedMessage: interfaceMessage|null|undefined = parseMessage(samSocket, msg);
                if (!parsedMessage) continue;

                if (parsedMessage.contentType === enumMessage.protocolMessage) continue;
                //console.log(parsedMessage)

                commandRouter.handler(samSocket, parsedMessage);
            }
        });

    } catch (error) {
        Logger.error(enumContext.WhatsappEvents, 'Messages Upsert')
    }
}