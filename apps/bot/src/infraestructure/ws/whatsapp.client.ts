import P from "pino"
import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerCredsEvents, registerConnectionEvent, registerMessagesEvent } from "./whatsapp.events.js";

export async function startWhatsappBot(name?: string) {

    const { state, saveCreds } = await createAuthState()
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        browser: [ name ? `SAM - ${name}` : `SAM`, 'Linux', "2.3000.1039785632-alpha" ],
        // Chrome / Safari / Firefox / Edge / Opera
        logger: P({ level: "silent" }),
        // silent / fatal / error / warn / info / debug / trace
        syncFullHistory: false,
        qrTimeout: 20_000,
        markOnlineOnConnect: true,
        keepAliveIntervalMs: 60_000,
        generateHighQualityLinkPreview: true,
        shouldIgnoreJid: (jid) => {
            return jid.includes("broadcast")
        }
    });


    registerCredsEvents(sam, saveCreds);
    registerConnectionEvent(sam);
    registerMessagesEvent(sam);

}
