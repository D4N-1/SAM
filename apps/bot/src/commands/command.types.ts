import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../modules/messages/msg.types.js";

interface ctx {
    socket: any,
    parsed: any,
    message: any
}

export interface Command {
    name: string,
    aliases?: string[],
    execute(ctx: ctx): Promise<void>;
}

export interface ParsedCommand {
    command: string,
    args: string[]
}
