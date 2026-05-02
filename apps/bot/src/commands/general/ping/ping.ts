import { wait } from "../../../common/utils/wait.util.js";
import type { Command } from "../../command.types.js";
import { enumPingMessages } from "./ping.enums.js";
import { getPingMessage } from "./ping.utils.js";

export const pingCommand: Command = {
    name: "ping",
    aliases: ["p", "pong"],

    async execute(ctx) {
        const { socket, message } = ctx;

        const start = Date.now();
        const start_text = getPingMessage(enumPingMessages.CALCULANDO);

        const send = await socket.sendMessage(message.chatId, { text: start_text } );
        const end = Date.now();

        const diff = end - start;

        await wait(4_000)

        const end_message = getPingMessage(enumPingMessages.CALCULADO, diff)
        await socket.sendMessage(message.chatId, { edit: send.key, text: end_message } );
    }
}