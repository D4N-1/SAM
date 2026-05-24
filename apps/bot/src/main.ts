import { Logger } from "./common/utils/logger.util.js";
import './common/utils/env.util.js'
import { startWhatsappBot } from "./estructure/whatsapp-client.js";


async function bootstrap() {

    try {

        Logger('MainApplication', 'Starting Sam application...')
    
        const BOT_NUMBER = process.env.BOT_NUMBER
        if (!BOT_NUMBER) throw new Error('Se requiere numero del BOT')

        await startWhatsappBot(BOT_NUMBER)

    } catch(error) {

        if (error instanceof Error) {
            Logger('MainApplication', error?.message, null, true)
        } else {
            console.error(error)
        }
    }
}

bootstrap()