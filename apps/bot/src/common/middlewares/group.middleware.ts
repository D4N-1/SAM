import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";
import { Api } from "../utils/api.util.js";
import Logger from "../utils/logger.util.js";
import { SyncManager } from "../utils/sync-manager.util.js";


export class GroupMiddleware implements SamMiddleware {

    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { message, sam } = context;
        const { chatId, botUid } = message;

        try {

          if (!chatId || !chatId.endsWith('@g.us')) return next();

          const res = await Api.get(`/groups/uid/${chatId}`, { uid: botUid! });
          if (res.status === 200) return next();


          Logger.log('GroupMiddleware', `Sincronizando grupo detectado: ${chatId}`);
          await SyncManager.syncGroups(sam, chatId, botUid!);

          next()

            /*
{
  id: '120363419101925665@g.us',
  addressingMode: 'lid',
  subject: '✦ 𝘽𝙀𝙏𝘼',
  subjectOwner: '573115548811@s.whatsapp.net',
  subjectOwnerLid: '131808872145020@lid',
  subjectTime: 1767098916,
  size: 7,
  creation: 1749488640,
  owner: undefined,
  ownerLid: undefined,
  ownerCountry: undefined,
  desc: 'No hay reglas (Ni sentido común)',
  descId: '392D1A5B83AD92DD3F84E7AF9768C95E',
  descOwner: '573208201009@s.whatsapp.net',
  descOwnerLid: '159893176774698@lid',
  linkedParent: '120363421558621647@g.us',
  restrict: true,
  announce: false,
  isCommunity: false,
  isCommunityAnnounce: false,
  joinApprovalMode: false,
  memberAddMode: true,
  participants: [
    {
      id: '584128529930@s.whatsapp.net',
      lid: '40523016446204@lid',
      admin: null
    },
    {
      id: '584125918535@s.whatsapp.net',
      lid: '176411654537395@lid',
      admin: 'admin'
    },
    {
      id: '584121569143@s.whatsapp.net',
      lid: '143250094563526@lid',
      admin: 'admin'
    },
    {
      id: '573208201009@s.whatsapp.net',
      lid: '159893176774698@lid',
      admin: 'admin'
    },
    {
      id: '573115548811@s.whatsapp.net',
      lid: '131808872145020@lid',
      admin: 'admin'
    },
    {
      id: '5218661343411@s.whatsapp.net',
      lid: '143125574107385@lid',
      admin: null
    },
    {
      id: '51900115616@s.whatsapp.net',
      lid: '88408076632311@lid',
      admin: 'admin'
    }
  ],
  ephemeralDuration: undefined
}
{
  id: '120363421558621647@g.us',
  addressingMode: 'lid',
  subject: '🜅 𝙎𝘼𝙈 ⤫ 𝘾𝙊𝙈𝙐𝙉𝙄𝘿𝘼𝘿',
  subjectOwner: '573208201009@s.whatsapp.net',
  subjectOwnerLid: '159893176774698@lid',
  subjectTime: 1766598618,
  size: 5,
  creation: 1748903190,
  owner: undefined,
  ownerLid: undefined,
  ownerCountry: undefined,
  desc: '𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤 𝙖 𝙡𝙖 𝙘𝙤𝙢𝙪𝙣𝙞𝙙𝙖𝙙 𝙙𝙚 𝙎𝘼𝙈\n' +
    '\n' +
    '✧ Sientete libre y en casa para ingresar a cualquier grupo\n' +
    '\n' +
    '✧ No hay reglas, buscamos libertad y calma en todos los integrantes\n' +
    '\n' +
    '✧ Cualquier duda, puedes mencionar a los admins de dicho grupo\n' +
    '\n' +
    '✧ 🜅 𝙎𝘼𝙈 ⤫ ⌯𝘾𝘼𝙉𝘼𝙇\n' +
    'https://whatsapp.com/channel/0029Vb6ZB1o9xVJXchnYrH1n',
  descId: '65BD42D4CF87C563',
  descOwner: '573208201009@s.whatsapp.net',
  descOwnerLid: '159893176774698@lid',
  linkedParent: undefined,
  restrict: false,
  announce: false,
  isCommunity: true,
  isCommunityAnnounce: false,
  joinApprovalMode: false,
  memberAddMode: false,
  participants: [
    {
      id: '584128529930@s.whatsapp.net',
      lid: '40523016446204@lid',
      admin: 'admin'
    },
    {
      id: '584121569143@s.whatsapp.net',
      lid: '143250094563526@lid',
      admin: 'admin'
    },
    {
      id: '573115548811@s.whatsapp.net',
      lid: '131808872145020@lid',
      admin: 'admin'
    },
    {
      id: '51900115616@s.whatsapp.net',
      lid: '88408076632311@lid',
      admin: 'superadmin'
    },
    {
      id: '50244407893@s.whatsapp.net',
      lid: '85375829733438@lid',
      admin: 'admin'
    }
  ],
  ephemeralDuration: undefined
}

            */

        } catch (error) {
          console.error(error)
        }

        return next();
    }
}