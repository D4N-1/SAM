import { random } from "../../../common/utils/function.util.js";
import messages from "../json/bot-telemetry.messages.json" with { type: "json" }

export interface interfaceTelemetry {
    botName: string,
    uid: string,
    groups: number,
    communities: number,
    uptime: number,
    prefix: string,
    date: Date,
    mode: string,
    role: string
}

export async function getTelemetryText(data: interfaceTelemetry) {

    const { botName, uid, groups, communities, uptime, prefix, date, mode, role } = data;
    let textSelected = random(messages).join('\n')

    textSelected = textSelected.replace('{botName}', botName);
    textSelected = textSelected.replace('{uid}', uid);
    textSelected = textSelected.replace('{groups}', groups);
    textSelected = textSelected.replace('{communities}', communities)
    textSelected = textSelected.replace('{uptime}', uptime + ' s');
    textSelected = textSelected.replace('{prefix}', prefix);
    textSelected = textSelected.replace('{date}', date);
    textSelected = textSelected.replace('{mode}', mode);
    textSelected = textSelected.replace('{role}', role)

    return textSelected

}