import Logger from "./common/utils/logger.util.js";
import './common/utils/env.util.js'
import { startWhatsappBot } from "./estructure/whatsapp-client.js";


async function bootstrap() {

    try {

        Logger('MainApplication', 'Starting Sam application...')
    
        const BOT_NUMBER = process.env.BOT_NUMBER
        if (!BOT_NUMBER) throw new Error('Se requiere UID del BOT')
        const BOT_CODE = process.env.BOT_CODE
        if (!BOT_CODE) throw new Error('Se requiere el CODE del BOT')

        await startWhatsappBot(BOT_NUMBER, BOT_CODE)

    } catch(error) {

        if (error instanceof Error) {
            Logger('MainApplication', error?.message, null, true)
        } else {
            console.error(error)
        }
    }
}

bootstrap()