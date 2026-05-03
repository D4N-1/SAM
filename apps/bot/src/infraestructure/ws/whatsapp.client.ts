import P from "pino"
import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerCredsEvents, registerConnectionEvent, registerMessagesEvent } from "./whatsapp.events.js";

export async function startWhatsappBot() {

    const { state, saveCreds } = await createAuthState()
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        browser: [ "SAM", "SAM", "10.0.22631" ],
        logger: P({ level: "silent" }),
        // silent / fatal / error / warn / info / debug / trace
        syncFullHistory: false,
        shouldIgnoreJid: (jid) => {
            return jid.includes("broadcast")
        }
    });


    registerCredsEvents(sam, saveCreds);
    registerConnectionEvent(sam);
    registerMessagesEvent(sam);

    return sam;
}
