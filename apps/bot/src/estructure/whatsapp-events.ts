import * as qrcode from "qrcode"
import { DisconnectReason } from "@itsliaaa/baileys";
import { Boom } from "@hapi/boom";
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
import { groupUpdate } from "../common/utils/group-update.util.js";

let isConnecting = false;

export async function registerConnectionEvent(uid: string, code: string, sam: any) {

    try {
    
        sam.ev.on("connection.update", async (data: any) => {

            let { connection, qr, lastDisconnect } = data

            console.log(data)
            if (qr) console.log( await qrcode.toString(qr, { type: "terminal", small: true }) )

            if (connection) {
                console.log("\n" + msgSTATUS_TITLE)
                console.log(msgSTATUS_CONNECTION[connection as keyof typeof msgSTATUS_CONNECTION] + '\n')
            }

            if (connection === 'connecting') {
                if (isConnecting) return;
                isConnecting = true
            }

            if (connection === 'connecting' && !sam.authState.creds.registered) {

                await wait(4_000)

                console.log(`Solicitando codigo de emparejamiento a WhatsApp...`)


                //await sam.requestPairingCode(uid, code)

                console.log(`CODIGO DE EMPAREJAMIENTO: ${code}`)

            } else if (connection === enumStatusConnection.CLOSE) {
                isConnecting = false

                const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
                const shouldReconnect = new Boom(connection?.lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log(reason)

                //if (reason == 401)

                if (shouldReconnect) {
                    Logger.error('WhatsappEvents', `Reintentando conexión en 5 segundos...`)
                    await wait(1_000);
                    startWhatsappBot(uid, code);
                }
            }

            if (connection === enumStatusConnection.OPEN) {
                Logger.log(enumContext.WhatsappEvents, 'SAM en ACTIVO')
                sendAliveInterval(sam);
                registerMessagesEvent(sam);
                registerGroupsEvent(sam)
            }
        })

    } catch (error) {
        Logger.error(enumContext.WhatsappEvents, 'Connection Update')
    }

}


export function registerCredsEvents(sam: any, saveCreds: any) {

    sam.ev.on("creds.update", saveCreds);

}


export function sendAliveInterval(sam: any) {

    setInterval(async () => {
        try {
          if (sam.ws.isOpen) {
            Logger.log('Ping', 'Enviando ping...')
            await sam.sendPresenceUpdate('available')
          }
        } catch (error:any) {
          console.log("❌ Error al enviar ping:", error?.message)
        }
    }, 60_000)
}


export async function registerMessagesEvent(samSocket: any) {

    try {


        samSocket.ev.on("messages.upsert", async (data: any) => {



            if (!data.messages || data.messages.length === 0) return;

            const msg = data.messages[0];

            if (!msg.key) return;


            //console.log( JSON.stringify( msg, null, 2) )
            let parsedMessage: interfaceMessage|null|undefined = parseMessage(samSocket, msg);
            if (!parsedMessage) return;

            if (parsedMessage.contentType === enumMessage.protocolMessage) return;

            commandRouter.handler(samSocket, parsedMessage);
                
        });




    } catch (error) {
        Logger.error(enumContext.WhatsappEvents, 'Internal')
    }
}


export async function registerGroupsEvent(samSocket: any) {

    try {

        samSocket.ev.on("groups.update", async (data: any) => {

            console.log(data)
            for (let update of data) {

                groupUpdate(samSocket, update)

            }
   
        })

    } catch (error) {
        Logger.error(enumContext.WhatsappEvents, 'Internal')
        console.error(error);
    }
}
