import { enumBotRole } from "src/modules/bots/entities/bot.entity";
import { enumRole } from "../enums/role.enum";

export interface ClientRequest {
    type: string,
    uuid: string,
    role?: enumRole|enumBotRole|undefined,
    contactUid?: string|undefined,
    ownerContactUid?: string|undefined
}
