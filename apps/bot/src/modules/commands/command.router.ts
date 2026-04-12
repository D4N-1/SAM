import { commands } from "./handlers/index.js"
import type { ParsedCommand } from "./command.types.js";
import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../messages/msg.types.js";


export async function routeCommand( parsed: ParsedCommand, sam: WASocket, message: ParsedMessage) {

    const command = commands[parsed.command];

    if (!command) return;

    await command.execute(parsed, sam, message)
}