import type { Command } from "../command.types.js";
import { pingCommand } from "./ping.js";

export const commands: Record<string, Command> = {
  ping: pingCommand,
};