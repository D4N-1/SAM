import type { WASocket } from "@itsukichan/baileys";
import type WhatsappService from "../../estructure/whatsapp.service.js";
import { Api } from "./api.util.js";
import Logger from "./logger.util.js";

export class SyncManager {

    static async syncGroups(sam: WhatsappService|WASocket, chatId: string): Promise<void> {
        try {
            const group = await sam.groupMetadata(chatId);
            if (!group) return;

            const linkedParent = group?.linkedParent;
            const uniqueContacts = new Map<string, { uid: string; lid?: string }>();

            if (group.participants) {
                group.participants.forEach((p: any) => {
                    const uid = p?.id?.split('@')[0];
                    if (uid) uniqueContacts.set(uid, { uid, lid: p?.lid?.split('@')[0] });
                });
            }

            let community: any = null;
            let communityRes: any = null;

            if (linkedParent) {
                communityRes = await Api.get(`/communities/uid/${linkedParent.split('@')[0]}`).catch(() => null);

                if (!communityRes || communityRes.status !== 200) {
                    community = await sam.groupMetadata(linkedParent).catch(() => null);

                    if (community && community.participants) {
                        community.participants.forEach((p: any) => {
                            const uid = p?.id?.split('@')[0];
                            if (uid) uniqueContacts.set(uid, { uid, lid: p?.lid?.split('@')[0] });
                        });
                    }
                }
            }

            const bulkContacts = Array.from(uniqueContacts.values());
            if (bulkContacts.length > 0) await Api.post(`/contacts/bulk`, bulkContacts).catch(() => null);
            

            console.log(communityRes?.data)
            if (community && communityRes?.status !== 200) {
                const communityPost = await Api.post(`/communities`, {
                    uid: community.id.split('@')[0],
                    name: community.subject,
                    nameTime: community.subjectTime,
                    size: community.size,
                    creation: community.creation,
                    description: community.desc
                }).catch(() => null);

                console.log('COMMUNITY INSERTION:', communityPost?.data?.community.subject);
            }

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
                ephemeralDuration: group?.ephemeralDuration
            }).catch(() => null);
            
            console.log('GROUP INSERTION:', groupPost?.data?.group?.subject);

            await Api.patch(`/groups/${group.id.split('@')[0]}`, {
                ownerUid: group?.owner?.split('@')[0] || group.subjectOwner?.split('@')[0],
                descriptionOwnerUid: group.descOwner?.split('@')[0] || group?.owner?.split('@')[0],
                nameOwnerUid: group?.subjectOwner?.split('@')[0]
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
        }
    }
}