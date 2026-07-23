import type { interfaceContact } from "./contact.interface.ts";

export interface interfaceWsGroup {

    id: string,
    addressingMode: string,
    subject: string,
    subjectOwner: '573208201009@s.whatsapp.net',
    subjectOwnerLid: '159893176774698@lid',
    subjectTime: 1766598618,
    size: 5,
    creation: 1748903190,
    owner: undefined,
    ownerLid: undefined,
    ownerCountry: undefined,
    desc: string,
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
    participants: interfaceGroupParticipant[],
    ephemeralDuration: undefined
}

/*
{
  uuid: '9b44b763-8ae2-42c3-b698-dd56a3f3def8',
  createdAt: '2026-06-01T04:15:18.405Z',
  updatedAt: '2026-07-23T04:11:19.000Z',
  deletedAt: null,
  community: {
    uuid: 'b5eddd1c-fd0b-4952-986d-dc51b12895d0',
    createdAt: '2026-06-01T04:15:18.388Z',
    updatedAt: '2026-06-02T05:17:41.000Z',
    deletedAt: null,
    uid: '120363421558621647',
    name: '🜅 𝙎𝘼𝙈 ⤫ 𝘾𝙊𝙈𝙐𝙉𝙄𝘿𝘼𝘿',
    nameTime: '2025-12-24T17:50:18.000Z',
    size: 5,
    creation: '2025-06-02T22:26:30.000Z',
    description: '𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤 𝙖 𝙡𝙖 𝙘𝙤𝙢𝙪𝙣𝙞𝙙𝙖𝙙 𝙙𝙚 𝙎𝘼𝙈\n' +        
      '\n' +
      '✧ Sientete libre y en casa para ingresar a cualquier grupo\n' +
      '\n' +
      '✧ No hay reglas, buscamos libertad y calma en todos los integrantes\n' +
      '\n' +
      '✧ Cualquier duda, puedes mencionar a los admins de dicho grupo\n' +
      '\n' +
      '✧ 🜅 𝙎𝘼𝙈 ⤫ ⌯𝘾𝘼𝙉𝘼𝙇\n' +
      'https://whatsapp.com/channel/0029Vb6ZB1o9xVJXchnYrH1n', 
    invitationLink: null,
    publicLink: false
  },
  uid: '120363419101925665',
  name: '✦ 𝘽𝙀𝙏𝘼',
  nameTime: '2026-07-23T03:34:43.000Z',
  nameOwner: {
    uuid: 'f5d1624a-6e53-44e1-a9fd-febfdfc61261',
    createdAt: '2026-05-27T02:47:27.445Z',
    updatedAt: '2026-07-22T03:16:16.000Z',
    deletedAt: null,
    uid: '573208201009',
    lid: '159893176774698',
    name: 'D4N1.'
  },
  size: 8,
  creation: '2025-06-09T17:04:00.000Z',
  owner: null,
  description: 'No hay reglas (Ni sentido común) :D.',
  descriptionOwner: {
    uuid: 'f5d1624a-6e53-44e1-a9fd-febfdfc61261',
    createdAt: '2026-05-27T02:47:27.445Z',
    updatedAt: '2026-07-22T03:16:16.000Z',
    deletedAt: null,
    uid: '573208201009',
    lid: '159893176774698',
    name: 'D4N1.'
  },
  restrict: true,
  announce: false,
  joinApprovalMode: false,
  memberAddMode: true,
  ephemeralDuration: 7776000,
  realm: null,
  participants: null,
  settings: null
}

*/
export interface interfaceGroup {

    uuid: string;
    uid: string;
    name: string;
    community: interfaceCommunity;
    nameTime?: number;
    nameOwner?: interfaceContact;
    size: number;
    creation: Date;
    owner?: interfaceContact;
    description?: string;
    descriptionOwner?: interfaceContact;
    restrict?: boolean;
    announce?: boolean;
    joinApprovalMode?: boolean;
    memberAddMode?: boolean;
    ephemeralDuration?: enumEphemeralDuration;
    realmName?: string;
    participants?: interfaceGroupParticipant[] | [];
    settings?: GroupSettingsDto;
    createdAt: '2026-06-01T04:15:18.405Z',
    updatedAt: '2026-07-23T04:11:19.000Z'|null,
    deletedAt: string|null;


}


export interface interfaceCommunity {

    uuid: 'b5eddd1c-fd0b-4952-986d-dc51b12895d0',
    createdAt: '2026-06-01T04:15:18.388Z',
    updatedAt: '2026-06-02T05:17:41.000Z'|null,
    deletedAt: string|null,
    uid: '120363421558621647',
    name: '🜅 𝙎𝘼𝙈 ⤫ 𝘾𝙊𝙈𝙐𝙉𝙄𝘿𝘼𝘿',
    nameTime: '2025-12-24T17:50:18.000Z',
    size: 5,
    creation: '2025-06-02T22:26:30.000Z',
    description: '𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤 𝙖 𝙡𝙖 𝙘𝙤𝙢𝙪𝙣𝙞𝙙𝙖𝙙 𝙙𝙚 𝙎𝘼𝙈\n'
    invitationLink: string|null,
    publicLink: false

}


export enum enumEphemeralDuration {
    OFF = 0,
    DAY = 86400,
    WEEK = 604800,
    MONTHS_3 = 7776000
}



export class GroupSettingsDto {

    active?: boolean = true;
    perfil?: boolean = true;
    gacha?: boolean = true;
    nsfw?: boolean = false;
    media?: boolean = true;
    reaction?: boolean = true;
    welcome?: GreetingsDto;
    goodbye?: GreetingsDto;

}



class GreetingsDto {

    active?: boolean = true;
    text?: string;
    mode?: boolean = false;
    image?: string;
    avatar?: boolean = true;

}

export interface interfaceGroupParticipant {
    id: string,
    lid: string,
    phoneNumber: string,
    admin: 'admin'|'superadmin'|null;
}