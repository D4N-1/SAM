import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerCredsEvents, registerWhatsappAccount } from "./whatsapp.events.js";

export async function startWhatsappBot() {

    const { state, saveCreds } = await createAuthState()

    console.log(state)
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        browser: [ "SAM", "SAM", "10.0.22631" ]
    });

    registerCredsEvents(sam, saveCreds);
    registerWhatsappAccount(sam);

    return sam;
}
