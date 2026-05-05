import type { WAPresence, WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../modules/messages/msg.types.js";

interface ctx {
    socket: any,
    parsed: any,
    message: any,
    sendMessage(text: string): Promise<any>,
    editMessage(text: string, key: any): Promise<any>,
    readMessage(key: any): Promise<any>,
    sendPresenceUpdate(type: WAPresence, chatId: string): Promise<any>
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
