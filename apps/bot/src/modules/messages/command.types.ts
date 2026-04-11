import type { contextCommand } from "./command.contex.js";


export interface Command {
    name: string,
    aliases?: string[],
    execute(ctx: contextCommand, args: string[]): Promise<void>;
}

export interface ParsedCommand {
    command: string,
    args: string[]
}