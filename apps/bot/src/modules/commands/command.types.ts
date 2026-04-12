import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../messages/msg.types.js";

export interface Command {
    name: string,
    aliases?: string[],
    execute(parsed: ParsedCommand, sam: WASocket, message: ParsedMessage): Promise<void>;
}

export interface ParsedCommand {
    command: string,
    args: string[]
}
