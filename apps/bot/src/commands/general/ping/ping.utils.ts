import { msgSYSTEM_MESSAGES } from "../../../shared/messages/system.message.js";
import { random } from "../../../shared/utils/array.util.js";
import type { enumPingStates } from "./ping.enums.js";
import messages from "./ping.messages.json" with { type: "json" }

export function getPingMessage (type: enumPingStates, latency?: number): string {

    let selected = random( messages[type] );
    if (!selected) return msgSYSTEM_MESSAGES.MESSAGE_NOT_FOUND;
    if (latency) selected = selected.replace('{latency}', latency.toString())
    return selected;

}