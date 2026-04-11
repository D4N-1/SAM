import * as qrcode from "qrcode"
import { deleteAuth } from "./whatsapp.auth.js"

export function registerWhatsappAccount(socket: any) {
    
    socket.ev.on("connection.update", async (data: any) => {

        console.log(data.connection)

        if (data.connection == "connecting" || data.qr) {

            if (!data.qr) return

            console.log( await qrcode.toString(data.qr, { type: "terminal", small: true }) )

        }

        if (data.connection == "close") {

            const reason = data?.lastDisconnect?.error?.output?.statusCode;

            if (reason == 401) {
                console.log(reason)
                await deleteAuth()
                process.exit(0)
            }

            process.exit(1)
        }
    })

}

export function registerCredsEvents(socket: any, saveCreds: any) {

    socket.ev.on("creds.update", saveCreds);

}