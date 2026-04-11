import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./whatsapp.auth.js";
import { registerWhatsappAccount } from "./whatsapp.events.js";

export async function startWhatsappBot() {

    const { state, saveCreds } = await createAuthState()

    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        browser: [ "SAM", "Chrome", "10.0.22631" ]
    });

    sam.ev.on("creds.update", saveCreds);

    registerWhatsappAccount(sam);

    return sam;
}
