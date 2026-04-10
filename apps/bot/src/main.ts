import { makeWASocket, useMultiFileAuthState } from "@itsukichan/baileys"
import * as qrcode from "qrcode"
import path from "node:path"


console.log( path.resolve( "apps", "bot", "src", "auth") )

const { state, saveCreds } = await useMultiFileAuthState( path.resolve( "auth" ) )


const sam:any = makeWASocket({
    version: [2, 3000, 1037076227],
    auth: state,
    browser: [ "SAM", "Chrome", "10.0.22631" ]
})


sam.ev.on("creds.update", saveCreds)

sam.ev.on("connection.update", async (data: any) => {
    
    console.log(data)

    if (!data.qr) return

    console.log( await qrcode.toString(data.qr, { type: "terminal", small: true }) )
})
