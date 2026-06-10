import type interfaceKey from "./key-message.interface.js"

export interface interfaceMessageOptions {
    text?: string|undefined,
    image?: Buffer|undefined,
    caption?: string|undefined,
    video?: Buffer|undefined,
    audio?: Buffer|undefined,
    sticker?: Buffer|undefined,
    document?: Buffer|undefined,
    mimetype?: string|undefined,
    fileName?: string|undefined,
    ptt?: boolean|undefined,
    gifPlayback?: boolean|undefined,
    reply?: interfaceReply|undefined,
    mentions?: string[]|undefined,
    mentionAll?: boolean|undefined,
    canal?: boolean|undefined,
    footer?: boolean|undefined,
    edit?: interfaceKey|undefined,
    forward?: boolean|undefined,
    preview?: {
        title?: string|undefined,
        description?: string|undefined,
        image: Buffer|undefined,
    }
    miniPreview?: Buffer|undefined,
    externalPreview?: Buffer|undefined,
    secure?: boolean|undefined,
    ai?: boolean|undefined,
    nativeflow?: interfaceNativeFlow|undefined

}

export interface interfaceReply {
    msg: any,
    sender: any
}

export interface NativeActionText {
    text: string;
    id: string;
    icon?: string|undefined;
}

export interface NativeActionCall {
    text: string;
    call: string;
}

export interface NativeActionCopy {
    text: string;
    copy: string;
}

export interface NativeActionUrl {
    text: string;
    url: string;
    useWebview?: boolean|undefined;
}

export type typeNativeAction = NativeActionText | NativeActionCall | NativeActionCopy | NativeActionUrl | interfaceList


export interface interfaceNativeFlow {

    audioFooter?: { url?: string }|Buffer|undefined,
    optionText?: string|undefined, // --- Optional, wrap all native flow into a single list
    optionTitle?: string|undefined, // --- Optional
    offerText?: string|undefined, // --- Optional, add an offer into message
    offerCode?: string|undefined, // --- Optional
    offerUrl?: string|undefined, // --- Optional
    offerExpiration?: Date|undefined, // --- Optional
    nativeFlow: typeNativeAction[],
    interactiveAsTemplate?: boolean|undefined, // --- Optional, wrap the interactive message into a template
}

export interface interfaceList {
      sections: ListAction[]
}

export interface ListAction {
    title: string,
    highlight_label?: string|undefined,
    rows: ListActionRow[]|[]
}

export interface ListActionRow {
    header?: string|undefined,
    title: string,
    description?: string|undefined,
    id: string
}