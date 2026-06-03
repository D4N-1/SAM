import type interfaceKey from "./key-message.interface.js"

export interface interfaceMessageOptions {
    gifPlayback?: boolean|undefined,
    reply?: {
        msg: any,
        sender: any
    }| undefined,
    mentions?: string[]|undefined,
    canal?: boolean|undefined,
    footer?: boolean|undefined,
    edit?: interfaceKey|undefined,
    forward?: boolean|undefined,
    preview?: Buffer|undefined

}