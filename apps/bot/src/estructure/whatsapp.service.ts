import type interfaceKey from "../common/interfaces/key-message.interface.js";
import type { interfaceMessageOptions } from "../common/interfaces/message-options.interface.js";
import { prepareWAMessageMedia } from '@itsliaaa/baileys'
import { Api } from "../common/utils/api.util.js";
import { randomFooter } from "../common/messages/footer.message.js";
import { simbolJADE } from "../common/constants/ascii.constant.js";


const url = 'https://sambot.live'

export async function getContact(id: string) {

    if ( id.endsWith('@lid') ) {
        const res = await Api.get(`/contacts/lid/${id.split('@')[0]}`)

        return res?.data

    } else {
        const res = await Api.get(`/contacts/uid/${id.split('@')[0]}`)

        return res?.data
    }
}

export async function count(type: 'communities' | 'groups') {

    return ( await Api.get(`/${type}/all`) )?.data
}

export default class WhatsappService {

    constructor(
        private readonly sock: any
    ) {}

    async sendMessage(chatId: string, options?: interfaceMessageOptions) {

            const messageOptions = await this.addMessageOptions(options);
            console.log(messageOptions)
            return this.sock.sendMessage(chatId, messageOptions)

    }



    async addMessageOptions(options: interfaceMessageOptions|undefined) {

        let res: any = {};
        const contextInfo: any = {};

        if (!options) return {};

        const { reply, mentions, canal, gifPlayback, edit, footer, forward, preview,
            externalPreview, miniPreview, secure, ai, image, caption, sticker, text, video, nativeflow } = options;

        if (edit) res.edit = edit;
        if (footer) res.footer = randomFooter();
        if (ai) res.ai = true
        if (secure) res.secureMetaServiceLabel = secure
        
        if (image) {
            res.image = image
            res.caption = caption || ''

        } else if (video) {

            res.video = video;
            res.caption = caption || ''
            if (gifPlayback) res.gifPlayback = gifPlayback;

        } else if (sticker) res.sticker = sticker;
        else res.text = text;

        if (reply) {
            contextInfo.quotedMessage = reply.msg.message
            contextInfo.stanzaId = reply.msg.key.id
            contextInfo.participant = reply.sender
        }

        if (forward) contextInfo.isForwarded = true
        if (mentions && mentions?.length > 0) contextInfo.mentionedJid = mentions

        if (canal) {
          contextInfo.isForwarded = true,
          contextInfo.forwardedNewsletterMessageInfo = {
              newsletterJid: "120363401659366134@newsletter",
              newsletterName: "🜅 𝙎𝘼𝙈 ⤫ ⌯𝘾𝘼𝙉𝘼𝙇",
              serverMessageId: 874
          }
        }

        res.contextInfo = contextInfo;


        if (preview) {

            const { imageMessage: image } = await prepareWAMessageMedia({
                image: preview.image
            }, {
               upload: this.sock.waUploadToServer,
               mediaTypeOverride: 'thumbnail-link'
            })

            image!.height = 480
            image!.width = 480

            res.text += `\n\n> ${simbolJADE} ${url}`
            res.linkPreview = {
                'matched-text': url,
                title: preview.title,
                description: preview.description,
                previewType: 0,
                jpegThumbnail: preview.image,
                highQualityThumbnail: image,
                linkPreviewMetadata: {
                    linkMediaDuration: 0, // --- Duration in seconds (for video/audio content)
                    socialMediaPostType: 1, // --- Enum: 0 = NONE, 1 = REEL, 2 = LIVE_VIDEO, 3 = LONG_VIDEO, 4 = SINGLE_IMAGE, 5 = CAROUSEL
                }
            }
            

        }

        if (miniPreview) {
            res.linkPreview = {
               'matched-text': url,
               title: 'ZZZ',
               description: 'ZZZ',
               previewType: 0,
               jpegThumbnail: miniPreview
            }

        }

        if (externalPreview) {

            res.externalAdReply = {
                mediaType: 1,
                title: 'title',
                body: `Desarrollado para ti ♡`,
                thumbnail: externalPreview,
                thumbnailUrl: 'https://sambot.live',
                sourceUrl: 'https://sambot.live',
                showAdAttribution: true,
                renderLargerThumbnail: true,
            }

        }



        if (nativeflow) res = { ...res, ...nativeflow }
        

        return Object.keys(res).length > 0 ? res
            : {}
          
    }


    async readMessage(key: interfaceKey) {
        return this.sock.readMessages([key])
    }

    async sendPresenceUpdate(type: any, chatId: string) {
        return this.sock.sendPresenceUpdate(type, chatId)
    }

    async onWhatsApp(uid: string) {
        return this.sock?.onWhatsApp(uid)
    }

    async fetchStatus(uid: string) {
        return this.sock.fetchStatus(uid)
    }

    async profilePictureUrl(uid: string) {
        return this.sock.profilePictureUrl(uid)
    }

    async groupMetadata(chatId: string) {
        return this.sock.groupMetadata(chatId)
    }

    /**
     * Obtiene TODOS los grupos donde se encuentra el BOT
     * 
     * ```NO USAR A LA LIGERA```
     * @returns 
     */
    async groupFetchAllParticipating() {
        return this.sock.groupFetchAllParticipating()
    }

    async getContact(uid: string): Promise<{uid: string, name: string }> {
        return getContact(uid)
    }

    async getMe() {
        return ( await Api.get('/auth/me') )?.data
    }

    async countGroups() {
        return count('groups')
    }

    async countCommunities() {
        return count('communities')
    }


}
