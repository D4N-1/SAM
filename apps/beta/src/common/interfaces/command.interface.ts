import type WhatsappService from "../../estructure/whatsapp.service.js";
import type { SamMiddleware } from "./middleware.interface.js";
import type interfaceMessage from "./parsed-message.interface.js";


export default interface interfaceCommand {

    name: string,
    aliases?: string[],
    middlewares?: SamMiddleware[],
    execute(message: interfaceMessage, sam: WhatsappService): Promise<void>
}
