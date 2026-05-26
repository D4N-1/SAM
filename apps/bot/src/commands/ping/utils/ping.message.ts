import { random } from "../../../common/utils/function.util.js";
import type { enumPingStates } from "./ping.enums.js";
import messages from "./ping.messages.json" with { type: "json" }

export class PingService {


    async getMessage(type: enumPingStates, latency?: number): Promise<string> {

        let selected = random( messages[type] );
        if (!selected) throw new Error( 'si' );
        if (latency) selected = selected?.replace( '{latency}', latency.toString() );
        return selected;

    }

}