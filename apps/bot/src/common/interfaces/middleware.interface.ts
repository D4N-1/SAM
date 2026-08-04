import type WhatsappService from "../../estructure/whatsapp.service.js";
import type { interfaceContact } from "./contact.interface.ts";
import type { interfaceWsGroup } from "./group.interface.ts";
import type interfaceMessage from "./parsed-message.interface.js";

export interface CommandContext {
    sam: WhatsappService,
    message: interfaceMessage,
    metadata: interfaceMetadataContext
}

export interface interfaceMetadataContext {
    group: interfaceWsGroup,
    contact: interfaceContact
}

export type NextFunction = () => Promise<void> | void;

export interface SamMiddleware {
    use(context: CommandContext, next: NextFunction): Promise<void>
}