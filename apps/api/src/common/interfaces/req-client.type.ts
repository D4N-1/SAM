import { enumBotRole } from "../enums/bot-role.enum";
import { enumRole } from "../enums/role.enum";

export interface ClientRequest {
    type: string,
    uuid: string,
    role?: enumRole|enumBotRole|undefined,
    contactUid?: string|undefined,
    ownerContactUid?: string|undefined
}
