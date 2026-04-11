import { commands } from "./commands/index.js"
import type { contextCommand } from "./command.contex.js"
import type { ParsedCommand } from "./command.types.js";

export async function routeCommand(
    parsed: ParsedCommand,
    context: contextCommand) {

    const command = commands[parsed.command];

    if (!command) return null;

    await command.execute(context, parsed.args)
}