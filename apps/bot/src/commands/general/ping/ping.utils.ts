import { random } from "../../../shared/utils/array.util.js";
import type { enumPingStates } from "./ping.enums.js";
import messages from "./ping.messages.json" with { type: "json" }

export function getPingMessage (type: enumPingStates, latency?: number): string|undefined {

    let selected = random( messages[type] );
    if (latency) selected = selected?.replace('{latency}', latency.toString())
    return selected;

}