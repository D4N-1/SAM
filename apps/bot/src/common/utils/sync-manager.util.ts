import type WhatsappService from "../../estructure/whatsapp.service.js";
import { Api } from "./api.util.js";
import Logger from "./logger.util.js";

export default async function syncGroups(sam: WhatsappService, chatId: string): Promise<void> {

    try {

        const group = await sam.groupMetadata(chatId);
        let image = await sam.profilePictureUrl(chatId).catch( () => null)

        console.log(group)

        if (!group) return;

        const linkedParent = group?.linkedParent;

        let community: any = null;
        let communityRes: any = null;

        if (linkedParent) {
            communityRes = await Api.get(`/communities/${linkedParent.split('@')[0]}`);

            if (communityRes.status === 404) community = await sam.groupMetadata(linkedParent).catch(() => null);
        }

        const contacts = group?.participants;
        if (contacts.length > 0) await Api.post(`/contacts/bulk`, { contacts });
            

        if (community && communityRes?.status === 404) {

            const communityPost = await Api.post(`/communities`, {
                uid: community.id.split('@')[0],
                name: community.subject,
                nameTime: community.subjectTime,
                size: community.size,
                creation: community.creation,
                description: community.desc
            });

            console.log('COMMUNITY INSERTION:', communityPost?.data?.community.subject);

        } else if (community) {

            await Api.patch(`/communities/${community?.id.split('@')[0]}`, {
                uid: community.id.split('@')[0],
                name: community.subject,
                nameTime: community.subjectTime,
                size: community.size,
                creation: community.creation,
                description: community.desc

            })

            console.log('COMMUNITY UPDATE')
        }

        const groupRes = await Api.get(`/groups/${group.id}`)

        if (groupRes.status === 404) {
            const groupPost = await Api.post(`/groups`, {

                communityUid: linkedParent?.split('@')[0] || null,
                uid: group.id.split('@')[0],
                name: group.subject,
                nameTime: group.subjectTime,
                size: group.size,
                creation: group.creation,
                description: group.desc,
                restrict: !!group.restrict,
                announce: !!group.announce,
                joinApprovalMode: !!group.joinApprovalMode,
                memberAddMode: !!group.memberAddMode,
                ephemeralDuration: group?.ephemeralDuration,
                image
            })
            
            console.log('GROUP INSERTION:', groupPost?.data?.group?.subject);

        } else {

            Api.patch(`/groups/${group.id}`, {

                communityUid: linkedParent?.split('@')[0] || null,
                uid: group.id.split('@')[0],
                name: group.subject,
                nameTime: group.subjectTime,
                size: group.size,
                creation: group.creation,
                description: group.desc,
                restrict: !!group.restrict,
                announce: !!group.announce,
                joinApprovalMode: !!group.joinApprovalMode,
                memberAddMode: !!group.memberAddMode,
                ephemeralDuration: group?.ephemeralDuration,
                participants: group.participants,
                image

            })

            console.log('GROUP UPDATE:', group?.subject);

        }

        await Api.patch(`/groups/${group.id.split('@')[0]}`, {
            ownerUid: group?.ownerPn?.split('@')[0] || group?.owner?.split('@')[0],
            descriptionOwnerUid: group.descOwnerPn?.split('@')[0] || group.descOwner?.split('@')[0],
            nameOwnerUid: group?.subjectOwnerPn?.split('@')[0] || group?.subjectOwner?.split('@')[0]
        }).catch(() => null);

        if (community) {
            await Api.patch(`/communities/${community.id.split('@')[0]}`, {
                ownerUid: community.owner?.split('@')[0] || community.subjectOwner?.split('@')[0],
                descriptionOwnerUid: community.descOwner?.split('@')[0] || community.owner?.split('@')[0],
                nameOwnerUid: community?.subjectOwner?.split('@')[0]
            }).catch(() => null);
        }


    } catch (error:any) {
        Logger.error('SyncManager', `Error en SyncManager: ${error.message}`);
        console.error(error)
    }
}