import { random } from "../utils/function.util.js"

export const msgHEADER_ERROR = (): string => {

    return random([
        '💔 𝗢𝗽𝘀𝘀, 𝗼𝗯𝘁𝘂𝘃𝗲 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 𝗱𝗲𝘀𝗰𝗼𝗻𝗼𝗰𝗶𝗱𝗼',
        '💔 𝗢𝗵𝗵𝗵 𝗻𝗼.. 𝗻𝗼 𝘀𝗲́ 𝗾𝘂𝗲 𝗮𝗰𝗮𝗯𝗮 𝗱𝗲 𝗽𝗮𝘀𝗮𝗿',
        '💔 𝗘𝘀𝗽𝗲𝗿𝗮𝗮𝗮𝗮𝗮𝗮, 𝘃𝗮 𝗹𝗲𝗻𝘁𝗼 𝗺𝗶 𝘄𝗶𝗳𝗶',
        '💔 𝗔𝘂𝗰𝗵.. 𝗰𝗿𝗲𝗼́ 𝗾𝘂𝗲 𝗺𝗲 𝗲𝗻𝗳𝗲𝗿𝗺𝗲́'
    ])

}

export const msgFOOTER_ERROR = (): string => {

    return random([
        '> Obtuve un error que me impide seguir, intenta de nuevo',
        '> Hay un error en el camino, ¿que tal si intentamos de nuevo?',
        '> No sé que pasó, pero te juro que la proxima vez no sucederá',
        '> Calma, no creo que sea algo grave, vamos de nuevo, ¿va?'
    ])
}