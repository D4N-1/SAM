import P from "pino"
import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerCredsEvents, registerWhatsappAccount } from "./whatsapp.events.js";

export async function startWhatsappBot() {

    const { state, saveCreds } = await createAuthState()
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        browser: [ "SAM", "SAM", "10.0.22631" ],
        logger: P({ level: "silent" })
        // silent / fatal / error / warn / info / debug / trace

    });

    registerCredsEvents(sam, saveCreds);
    registerWhatsappAccount(sam);

    return sam;
}
