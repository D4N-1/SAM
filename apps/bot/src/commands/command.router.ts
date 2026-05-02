import { commands } from "./index.js"
import type { ParsedCommand } from "./command.types.js";
import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../modules/messages/msg.types.js";
import { COMMAND_NOT_FOUND } from "../common/utils/log-commands.util.js";


export async function routeCommand( parsed: ParsedCommand, sam: WASocket, message: ParsedMessage) {

    const command = commands[parsed.command];

    if (!command) return console.log(COMMAND_NOT_FOUND);

    const ctx = {
        socket: sam,
        parsed,
        message
    }

    await command.execute(ctx)
}