import { random } from '../../../common/utils/function.util.js'
import messages from '../json/whatsapp.messages.json' with { type: 'json' }

export function formatToCuteUTC(isoString: Date): string {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Formato 24 horas
    timeZone: 'UTC'
});

  return formatter.format(date);
}


export async function getText(name?: string|undefined, number?: string|undefined, info?: string|undefined, updated?: Date|undefined) {

    const textSelected = random(messages)

    let text: string = textSelected.title;

    if (name) text += textSelected.name.replace('{name}', name);
    if (number) text += textSelected.number.replace('{number}', number.split('@')[0]);
    if (info) text += textSelected.info.replace('{info}', info);
    if (updated?.getTime() && info) text += textSelected.updated.replace('{updated}', formatToCuteUTC(updated))
    
    return text;

}