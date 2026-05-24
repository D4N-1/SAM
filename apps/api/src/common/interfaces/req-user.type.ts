import { Request } from "express";
import { enumRole } from "../enums/role.enum";

export interface AuthenticatedRequest extends Request {
    uuid: string,
    role: enumRole
}