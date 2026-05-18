import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    uuid: string,
    role: string
}