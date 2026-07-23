import { formatUTC } from '../../../../common/utils/format-date.util.js';
import { random } from '../../../../common/utils/function.util.js'
import messages from '../json/group.messages.json' with { type: 'json' }


export async function getText(name: string, community: string|undefined, description: string|undefined, size: number|undefined, admins: number|undefined, creation: Date|undefined) {

    const textSelected = random(messages)

    let text: string = textSelected.title;

    if (name) text += textSelected.name.replace('{name}', name);
    if (community) text += textSelected.community.replace('{community}', community);
    if (description) text += textSelected.description.replace('{description}', description.split('@')[0]);
    if (size) {
        text += textSelected.members.replace('{members}', size)
            .replace('{admins}', admins);
    }
    if (creation) text += textSelected.creation.replace('{creation}', formatUTC( creation ));
    
    return text;

}