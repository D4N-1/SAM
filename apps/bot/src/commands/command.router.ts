import { commands } from "./index.js"
import type { ParsedCommand } from "./command.types.js";
import type { WASocket } from "@itsukichan/baileys";
import type { ParsedMessage } from "../modules/messages/msg.types.js";
import { msgERROR_LOG_MESSAGES } from "../shared/messages/error.message.js";
import { handleError } from "../shared/errors/handler.error.js";


export async function routeCommand( parsed: ParsedCommand, sam: WASocket, message: ParsedMessage) {

    const command = commands[parsed.command];

    if (!command) return console.log(msgERROR_LOG_MESSAGES.NOT_FOUND);

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

    try {
        await command.execute(ctx)

    } catch (error) {
        await handleError(error, ctx)
    }
}