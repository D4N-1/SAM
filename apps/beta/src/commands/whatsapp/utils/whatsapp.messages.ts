import { formatUTC } from '../../../common/utils/format-date.util.js';
import { random } from '../../../common/utils/function.util.js'
import messages from '../json/whatsapp.messages.json' with { type: 'json' }


export async function getText(name?: string|undefined, number?: string|undefined, info?: string|undefined, updated?: Date|undefined) {

    const textSelected = random(messages)

    let text: string = textSelected.title;

    if (name) text += textSelected.name.replace('{name}', name);
    if (number) text += textSelected.number.replace('{number}', number.split('@')[0]);
    if (info) text += textSelected.info.replace('{info}', info);
    if (updated?.getTime() && info) text += textSelected.updated.replace('{updated}', formatUTC(updated))
    
    return text;

}