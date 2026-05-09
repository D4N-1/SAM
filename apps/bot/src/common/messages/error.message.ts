import { enumErrorCode } from "../errors/enum.error.js"

export const msgERROR_LOG_MESSAGES: Record<enumErrorCode, (ctx?: any) => string> = {
    INTERNAL: () => `[ ERROR ] Error interno`,

    MESSAGE_NOT_FOUND: (ctx) => `[ ERROR ] Mensaje `+
        `${ctx?.command ? ctx.commannd : ''} NO encontrado`,

    NOT_FOUND: (ctx) => `[ ERROR ] Comando ` +
        `${ctx?.command ? ctx.command : ''} NO encontrado`,

}

export const msgERROR_USER_MESSAGES: Record<enumErrorCode, (ctx?: any) => string> = {
    MESSAGE_NOT_FOUND: () => `🛑 *Mmmmm, no sé que responderte*\n\n> Ahorita mismo tengo un error al no saber como responder tu mensaje`,

    INTERNAL: () => `🛑 *Opss!*\n\n> Creo que soy incapaz de ejecutar este comando, algún cable esta roto quizás`,

    NOT_FOUND: (ctx) => `[ ERROR ] Comando ` +
    `${ctx?.command ? ctx.command : ''} NO encontrado`,

}