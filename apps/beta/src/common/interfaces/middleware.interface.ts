import type WhatsappService from "../../estructure/whatsapp.service.js";
import type interfaceMessage from "./parsed-message.interface.js";

export interface CommandContext {
    sam: WhatsappService,
    message: interfaceMessage,
    metadata?: Record<string, any>
}

export type NextFunction = () => Promise<void> | void;

export interface SamMiddleware {
    use(context: CommandContext, next: NextFunction): Promise<void> | void
}