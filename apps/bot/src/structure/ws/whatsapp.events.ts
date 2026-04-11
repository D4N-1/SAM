import * as qrcode from "qrcode"

export function registerWhatsappAccount(socket: any) {
    
    socket.ev.on("connection.update", async (data: any) => {

        console.log(data)

        if (!data.qr) return

        console.log( await qrcode.toString(data.qr, { type: "terminal", small: true }) )
    })
}