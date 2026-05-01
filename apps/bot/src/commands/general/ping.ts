import type { Command } from "../command.types.js";

export const pingCommand: Command = {
    name: "ping",
    aliases: ["p", "pong"],

    async execute(parsed, sam, message) {
        await sam.sendMessage(message.chatId, { text: "Pong!"} )
    }
}