import P from "pino"
import { Browsers, makeWASocket } from "@whiskeysockets/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerCredsEvents, registerConnectionEvent, registerMessagesEvent } from "./whatsapp.events.js";



export async function startWhatsappBot(name?: string) {

    const { state, saveCreds } = await createAuthState()
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        //browser: [ 'Windows', 'Edge', "2.3000.1039785632-alpha" ],
        browser: ['Ubuntu', 'Chrome', '110.0.0.0'],
        // Chrome / Safari / Firefox / Edge / Opera
        logger: P({ level: "silent" }),
        // silent / fatal / error / warn / info / debug / trace
        syncFullHistory: false,
        printQRInTerminal: false,
        //qrTimeout: 20_000,
        markOnlineOnConnect: true,
        keepAliveIntervalMs: 60_000,
        generateHighQualityLinkPreview: true,
        shouldIgnoreJid: (jid) => {
            return jid.includes("broadcast")
        },
        shouldSyncHistoryMessage: () => false
    });


    registerCredsEvents(sam, saveCreds);
    registerConnectionEvent(sam);
    registerMessagesEvent(sam);

}
