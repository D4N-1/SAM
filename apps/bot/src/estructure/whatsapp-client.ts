import P from "pino"
import { makeWASocket } from "@itsukichan/baileys";
import { registerCredsEvents, registerConnectionEvent, registerMessagesEvent, sendAliveInterval } from "./whatsapp-events.js";
import apiLoginService from "./whatsapp-login.service.js";
import Logger from "../common/utils/logger.util.js";
import enumContext from "../common/enums/context.enum.js";
import { useApiAuthState } from "./utils/whatsapp-auth.util.js";



export async function startWhatsappBot(uid: string, code: string) {

    
    if ( !await apiLoginService.signIn(uid, code) ) {

        Logger.error(enumContext.WhatsappClient, 'No se pudo iniciar sesion')
        process.exit(0)
    }

    
    const { state, saveCreds } = await useApiAuthState(uid);
    
    const sam:any = makeWASocket({
        version: [2, 3000, 1037076227],
        auth: state,
        //browser: [ 'Windows', 'Edge', "2.3000.1039785632-alpha" ],
        browser: ['Ubuntu', 'Chrome', '110.0.0.0'],
        // Chrome / Safari / Firefox / Edge / Opera
        logger: P({ level: "silent" }),
        // silent / fatal / error / warn / info / debug / trace

        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        shouldIgnoreJid: (jid) => {
            return jid.includes("broadcast") || jid.includes('@newsletter')
        },

        printQRInTerminal: false,
        //qrTimeout: 20_000,
        markOnlineOnConnect: true,

        connectTimeoutMs: 60_000,
        keepAliveIntervalMs: 30_000,
        generateHighQualityLinkPreview: true,
        linkPreviewImageThumbnailWidth: 300
    });


    sendAliveInterval(sam);
    registerConnectionEvent(uid, code, sam);
    registerCredsEvents(sam, saveCreds);
    registerMessagesEvent(sam);

}
