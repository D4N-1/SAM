import { enumErrorCode } from "../errors/enum.error.js"
import { Logger } from "./logger.util.js"


export const ERROR_LOG = {

    INTERNAL: (context: string) => { return Logger(context, `Error interno`, undefined, true ) },

}


export const ERROR_USER = {

    INTERNAL: (command: string, text?: string) => {

        if (text) return `🛑 *Opss!*\n\n> ${text}`
            return `🛑 *Opss!*\n\n> Obtuve un error al procesar ${command}`
    }

}