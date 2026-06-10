export interface interfaceGroup {

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

export interface interfaceGroupParticipant {
    id: string,
    lid: string,
    phoneNumber: string,
    admin: 'admin'|'superadmin'|null
}