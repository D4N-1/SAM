import { CommandRouter } from "./commands/command.router.js";
import { Logger } from "./common/utils/logger.util.js";
import { startWhatsappBot } from "./estructure/whatsapp.client.js";

async function bootstrap() {

    Logger('Main', 'Starting Sam application...')

    const commandRouter = new CommandRouter();
    commandRouter.registerCommands();
    
    await startWhatsappBot()
}

bootstrap()