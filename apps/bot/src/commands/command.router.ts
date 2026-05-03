import { commands } from "./index.js"
import type { ParsedCommand } from "./command.types.js";
import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../modules/messages/msg.types.js";
import { COMMAND_NOT_FOUND } from "../shared/messages/log.message.js";


export async function routeCommand( parsed: ParsedCommand, sam: WASocket, message: ParsedMessage) {

    const command = commands[parsed.command];

    if (!command) return console.log(COMMAND_NOT_FOUND);

    const ctx = {
        socket: sam,
        parsed,
        message,

        sendMessage: (text: string) => {
            return sam.sendMessage(message.chatId, { text: text })
        },
        editMessage: (text: string, key: any) => {
            return sam.sendMessage(message.chatId, { edit: key, text: text })
        }

    }

    await command.execute(ctx)
}