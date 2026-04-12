import type { Command } from "../command.types.js";

export const pingCommand: Command = {
    name: "ping",

    async execute(ctx) {
        await ctx.reply("Pong!")
    }
}