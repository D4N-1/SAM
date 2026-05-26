import P from "pino"
import { makeWASocket } from "@itsukichan/baileys";
import { createAuthState } from "./utils/whatsapp-auth.util.js";
import { registerCredsEvents, registerConnectionEvent, registerMessagesEvent } from "./whatsapp-events.js";
import { ApiLogin } from "./whatsapp-login.service.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";



export async function startWhatsappBot(uid: string, code: string) {

    const { state, saveCreds } = await createAuthState(uid);
    
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


    if ( !await ApiLogin.signIn(uid, code) ) {

        Logger.error(enumContext.WhatsappClient, 'No se pudo iniciar sesion')
        process.exit(0)
    }

    registerConnectionEvent(uid, code, sam);
    registerCredsEvents(sam, saveCreds);
    registerMessagesEvent(sam);

}
