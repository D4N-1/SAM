import { random } from "../../../common/utils/function.util.js";
import messages from "../json/bot-presentation.message.json" with { type: "json" }


export interface interfacePresentation {
    botName: string,
    name: string
}

export async function getPresentationText(data: interfacePresentation) {

    const { botName, name } = data;

    let textSelected = random(messages).join('\n')

    textSelected = textSelected.replace('{botName}', botName);
    textSelected = textSelected.replace('{name}', name);

    return textSelected

}