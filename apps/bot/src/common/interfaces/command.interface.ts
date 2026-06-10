import type WhatsappService from "../../estructure/whatsapp.service.js";
import type { SamMiddleware } from "./middleware.interface.js";
import type interfaceMessage from "./parsed-message.interface.js";


export default interface interfaceCommand {

    name: string,
    aliases?: string[],
    dirname?: string,
    middlewares?: (new (...args: any[]) => SamMiddleware)[],
    execute(message: interfaceMessage, sam: WhatsappService, metadata: Record<string, any>): Promise<void>
}
