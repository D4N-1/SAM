import { random } from "../../../common/utils/function.util.js"

const msgHEADER_ERROR = (): string => {

    return random([
        '💔 𝗢𝗽𝘀𝘀, 𝗼𝗹𝘃𝗶𝗱𝗲́ 𝗾𝘂𝗲 𝗱𝗲𝗯𝗶𝗮 𝗱𝗲𝗰𝗶𝗿',
        '💔 𝗢𝗵𝗵𝗵 𝗻𝗼.. 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 𝗰𝗼𝗻 𝗺𝗶 𝘁𝗲𝗰𝗹𝗮𝗱𝗼',
        '💔 𝗘𝘀𝗽𝗲𝗿𝗮𝗮𝗮𝗮𝗮𝗮, 𝘃𝗮 𝗹𝗲𝗻𝘁𝗼 𝗺𝗶 𝘄𝗶𝗳𝗶',
        '💔 𝗔𝘂𝗰𝗵.. 𝗺𝗲 𝗴𝗼𝗹𝗽𝗲𝗲́ 𝘆 𝗼𝗹𝘃𝗶𝗱𝗲́ 𝗾𝘂𝗲 𝗱𝗲𝗰𝗶𝗿'
    ])

}

const msgFOOTER_ERROR = (): string => {

    return random([
        '> Obtuve un error al repetir tu mensaje, intenta de nuevo',
        '> El mensaje se quedó a mitad de camino, ¿que tal si intentamos de nuevo?',
        '> Se me olvidó lo que debia repetir, pero te juro que la proxima vez no sucederá',
        '> Calma, algo falló con el mensaje, vamos de nuevo, ¿va?'
    ])
}

export const msgERROR = (): string => {
    return msgHEADER_ERROR() + '\n\n' + msgFOOTER_ERROR()
}