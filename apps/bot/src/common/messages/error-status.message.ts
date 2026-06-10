import path from "node:path"
import { random } from "../utils/function.util.js"
import fs from 'node:fs'
import fsAsync from 'node:fs/promises'
import type interfaceCommand from "../interfaces/command.interface.js"


const msgHEADER_ERROR = (arr?: any[]|undefined): string => {

    if (arr) return random(arr)

    return random([
        '💔 𝗢𝗽𝘀𝘀, 𝗼𝗯𝘁𝘂𝘃𝗲 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 𝗱𝗲𝘀𝗰𝗼𝗻𝗼𝗰𝗶𝗱𝗼',
        '💔 𝗢𝗵𝗵𝗵 𝗻𝗼.. 𝗻𝗼 𝘀𝗲́ 𝗾𝘂𝗲 𝗮𝗰𝗮𝗯𝗮 𝗱𝗲 𝗽𝗮𝘀𝗮𝗿',
        '💔 𝗘𝘀𝗽𝗲𝗿𝗮𝗮𝗮𝗮𝗮𝗮, 𝘃𝗮 𝗹𝗲𝗻𝘁𝗼 𝗺𝗶 𝘄𝗶𝗳𝗶',
        '💔 𝗔𝘂𝗰𝗵.. 𝗰𝗿𝗲𝗼́ 𝗾𝘂𝗲 𝗺𝗲 𝗲𝗻𝗳𝗲𝗿𝗺𝗲́'
    ])

}

const msgFOOTER_ERROR = (arr?: any[]|undefined): string => {

    if (arr) return random(arr);

    return random([
        '> Obtuve un error que me impide seguir, intenta de nuevo',
        '> Hay un error en el camino, ¿que tal si intentamos de nuevo?',
        '> No sé que pasó, pero te juro que la proxima vez no sucederá',
        '> Calma, no creo que sea algo grave, vamos de nuevo, ¿va?'
    ])
}

export async function GetErrorMessage(command?: interfaceCommand): Promise<string> {

    try {

        console.log(command)
        
        if (!command || !command?.dirname) return msgHEADER_ERROR() + '\n\n' + msgFOOTER_ERROR();

        const JSON_PATH = path.resolve( command.dirname, 'json', 'error.messages.json')
        const exits = fs.existsSync( JSON_PATH )

        if (!exits) return msgHEADER_ERROR() + '\n\n' + msgFOOTER_ERROR();

        const rawJson = await fsAsync.readFile(JSON_PATH, 'utf-8')
        const Error = JSON.parse(rawJson)

        return msgHEADER_ERROR(Error.header) + '\n\n' + msgFOOTER_ERROR(Error.footer)

    } catch {
        return msgHEADER_ERROR() + '\n\n' + msgFOOTER_ERROR()
    }
}
export default GetErrorMessage