import { Logger } from "./common/utils/logger.util.js";
import { startWhatsappBot } from "./estructure/whatsapp.client.js";

async function bootstrap() {

    Logger('MainApplication', 'Starting Sam application...')
    
    await startWhatsappBot()
}

bootstrap()