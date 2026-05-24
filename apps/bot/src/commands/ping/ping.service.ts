import { Api } from "../../common/utils/api.util.js";
import { random } from "../../common/utils/function.util.js";
import type { enumPingStates } from "./ping.enums.js";
import messages from "./ping.messages.json" with { type: "json" }

export const PingService = {


    get:
    {
        async message(type: enumPingStates, latency?: number): Promise<string> {

            let selected = random( messages[type] );
            if (!selected) throw new Error( 'si' );
            if (latency) selected = selected?.replace( '{latency}', latency.toString() );
            return selected;
        },

        async serverPing(): Promise<{ uptime: number, wsLatency: string }> {
            
            const res = await Api.get('/health')

            return {
                uptime: res.data.uptime,
                wsLatency: res.data.result.info.whatsapp.latency
            }
        }
    }



}