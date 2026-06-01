import type { WASocket } from "@itsukichan/baileys";
import { Api } from "./api.util.js";
import Logger from "./logger.util.js";
import { SyncManager } from "./sync-manager.util.js";


export async function groupUpdate(sam: WASocket, update: any) {

    try {

        let { id, author, subject=null, desc=null, announce=null, restrict=null } = update;

        console.log(update)

        const groupUid = id?.split('@')[0]
        const groupRes = await Api.get(`/groups/uid/${groupUid}`);

        const authorLid = author?.split('@')[0];

      
        if (groupRes?.status !== 200) {
            Logger.log('GroupUpdate', `Sincronizando grupo detectado: ${id}`);
            return await SyncManager.syncGroups(sam, id)
        }

        if (!authorLid) return;


        let text: string = "";
        let updateData: any = {}

        if (announce !== null) {

            updateData.announce = announce

            if (announce === true) text = `🔒 @${authorLid} 𝗵𝗮 𝗰𝗲𝗿𝗿𝗮𝗱𝗼 𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮 𝘀𝗼𝗹𝗼 𝗮𝗱𝗺𝗶𝗻𝘀`
            else if (announce === false) text = `🔓 @${authorLid} 𝗵𝗮 𝗮𝗯𝗶𝗲𝗿𝘁𝗼 𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮 𝘁𝗼𝗱𝗼𝘀`

        } else if (subject !== null) {

            const newGroup = await sam.groupMetadata(id)

            updateData.name = newGroup.subject;
            updateData.nameTime = Math.floor( Date.now() / 1000 );
            updateData.nameOwnerUid = authorLid;

            text = `📑 @${authorLid || '𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽𝗽'} 𝗵𝗮 𝗰𝗮𝗺𝗯𝗶𝗮𝗱𝗼 𝗲𝗹 𝗻𝗼𝗺𝗯𝗿𝗲 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮\n───────────────\n\n${updateData.name}`

        } else if (desc !== null) {

            updateData.description = desc;
            updateData.descriptionOwnerUid = authorLid

            text = `📑 @${authorLid || '𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽𝗽'} 𝗵𝗮 𝗰𝗮𝗺𝗯𝗶𝗮𝗱𝗼 𝗹𝗮 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝗰𝗶𝗼𝗻 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮\n───────────────\n\n${desc}`

        } else if (restrict !== null) {

            updateData.restrict = restrict

            if (restrict === true) text = `🔒 @${authorLid} 𝗵𝗮 𝗰𝗲𝗿𝗿𝗮𝗱𝗼 𝗹𝗼𝘀 𝗮𝗷𝘂𝘀𝘁𝗲𝘀 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮 𝘀𝗼𝗹𝗼 𝗮𝗱𝗺𝗶𝗻𝘀`
            else if (restrict === false) text = `🔓 @${authorLid} 𝗵𝗮 𝗮𝗯𝗶𝗲𝗿𝘁𝗼 𝗹𝗼𝘀 𝗮𝗷𝘂𝘀𝘁𝗲𝘀 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗮 𝘁𝗼𝗱𝗼𝘀`

        }


        if ( Object.keys( updateData ).length > 0 ) {
            const updateRes = await Api.patch(`/groups/${groupUid}`, updateData)

            console.log(updateRes.data)
        }

        if (text) {

            await sam.sendPresenceUpdate("composing", id)
            await sam.sendMessage(id, { text, mentions: [author] })

        }

    } catch (error) {
        console.error(error)
        Logger.error('groupUpdate', 'Error al actualizar grupos')
    }
}