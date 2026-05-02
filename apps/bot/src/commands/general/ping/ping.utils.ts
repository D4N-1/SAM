import { random } from "../../../common/utils/array.util.js";
import type { enumPingMessages } from "./ping.enums.js";
import messages from "./ping.messages.json" with { type: "json" }

export function getPingMessage (type: enumPingMessages, latency?: number): string|undefined {

    let selected = random( messages[type] );
    if (!selected) return undefined;
    if (latency) selected = selected.replace('{latency}', latency.toString())
    return selected;

}