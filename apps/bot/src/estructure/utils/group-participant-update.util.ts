import type { interfaceGroup } from "../../common/interfaces/group.interface.js";
import syncGroups from "../../common/utils/sync-manager.util.ts";
import WhatsappService from "../whatsapp.service.js";

export async function GroupParticipantUpdate(samSocket: any, update: any) {

    const sam = new WhatsappService(samSocket);

    const { id, participants, action, author=null } = update;

    await sam.sendPresenceUpdate('composing', id)

    syncGroups(sam, id)
    const group: interfaceGroup = await sam.groupMetadata(id);
    const admins = group.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.phoneNumber || p.id || p.lid);

    if (action === 'promote') {

        for (const participant of participants) {

            const authorUid = author?.split('@')[0]
            const participantUid = participant?.id?.split('@')[0]

            let text = `👑 @${authorUid} 𝗵𝗮 𝗮𝘀𝗰𝗲𝗻𝗱𝗶𝗱𝗼 𝗰𝗼𝗺𝗼 𝗮𝗱𝗺𝗶𝗻 𝗮\n\n@${participantUid}`

            return sam.sendMessage(id, { text, mentions: [...admins, author, participant?.phoneNumber] })
                        
        }
        
    } else if (action === 'demote') {

        for (const participant of participants) {

            const authorUid = author?.split('@')[0]
            const participantUid = participant?.id?.split('@')[0]

            let text = `👑 @${authorUid} 𝗵𝗮 𝗿𝗲𝘃𝗼𝗰𝗮𝗱𝗼 𝗰𝗼𝗺𝗼 𝗮𝗱𝗺𝗶𝗻 𝗮\n\n@${participantUid} `

            return sam.sendMessage(id, { text, mentions: [...admins, author, participant?.phoneNumber] })
                        
        }
    }
}