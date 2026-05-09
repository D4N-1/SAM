import { AppError } from "../../../common/errors/app.error.js";
import { enumErrorCode } from "../../../common/errors/enum.error.js";
import { wait } from "../../../common/utils/wait.util.js";
import type { Command } from "../../command.types.js";
import { enumPingStates } from "./ping.enums.js";
import { getPingMessage } from "./ping.utils.js";

export const pingCommand: Command = {
    name: "ping",
    aliases: ["p", "pong"],

    async execute(ctx) {
        const { socket, message } = ctx;

        await ctx.readMessage(message.key)
        const start = Date.now();
        const start_text = getPingMessage(enumPingStates.CALCULANDO);

        if (!start_text) throw new AppError(enumErrorCode.MESSAGE_NOT_FOUND);

        const send = await ctx.sendMessage(start_text);
        const end = Date.now();

        const diff = end - start;

        await wait(300)
        await ctx.sendPresenceUpdate("composing", message.chatId)
        await wait(4_000);

        const end_message = getPingMessage(enumPingStates.CALCULADO, diff);
        if (!start_text) throw new AppError(enumErrorCode.MESSAGE_NOT_FOUND);
        await socket.sendMessage(message.chatId, { edit: send.key, text: end_message } );

        await ctx.sendPresenceUpdate("paused", message.chatId)

    }
}