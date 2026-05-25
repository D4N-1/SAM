import { enumRole } from "../enums/role.enum";

export interface ClientRequest {
    type: string,
    uuid: string,
    role?: enumRole|undefined,
    contactUid?: string|undefined,
    ownerContactUid?: string|undefined
}
