import type { Command } from "../command.types.js";
import { pingCommand } from "./ping.js";

const commandsList = [
  pingCommand
]

export const commands: Record <string, Command> = {};

for (const cmd of commandsList) {
  commands[cmd.name] = cmd;

  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands[alias] = cmd;
    }
  }
}