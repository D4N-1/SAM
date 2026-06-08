import { random } from "../../../common/utils/function.util.js";
import messages from "../json/bot-presentation.message.json" with { type: "json" }


export interface interfacePresentation {
    botName: string,
    name: string
}

export async function getPresentationText(data: interfacePresentation) {

    const { botName, name } = data;

    const title = random( messages.title )
    const body = random( messages.body )
    const footer = random( messages.footer )

    let textSelected = title + '\n\n' + body + '\n\n' + footer

    textSelected = textSelected.replace('{botName}', botName);
    textSelected = textSelected.replace('{name}', name);

    return textSelected

}