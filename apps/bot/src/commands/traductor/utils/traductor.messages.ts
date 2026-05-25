import { random } from "../../../common/utils/function.util.js";


function HeadHint() {

    return random([
        '🌐 𝗧𝗲 𝗳𝗮𝗹𝘁𝗮 𝗲𝗹 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗾𝘂𝗲 𝗱𝗲𝘀𝗲𝗮𝘀 𝗾𝘂𝗲 𝘁𝗿𝗮𝗱𝘂𝘇𝗰𝗮',
        '🌐 𝗧𝗲 𝗳𝗮𝗹𝘁𝗮 𝗲𝗹 \`𝘁𝗲𝘅𝘁𝗼\` 𝗾𝘂𝗲 𝗱𝗲𝘀𝗲𝗮𝘀 𝗾𝘂𝗲 𝘁𝗿𝗮𝗱𝘂𝘇𝗰𝗮',
        '🌐 𝗖𝗿𝗲𝗼 𝗾𝘂𝗲 𝘁𝗲 𝗳𝗮𝗹𝘁𝗼 𝗱𝗲𝗰𝗶𝗿𝗺𝗲 𝗾𝘂𝗲 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗾𝘂𝗶𝗲𝗿𝗲𝘀 𝗾𝘂𝗲 𝘁𝗿𝗮𝗱𝘂𝘇𝗰𝗮',
        '🌐 𝗛𝗼𝗹𝗮, 𝗲𝘀𝘁𝗼𝘆 𝗮𝗾𝘂𝗶, 𝘀𝗼𝗹𝗼 𝗳𝗮𝗹𝘁𝗮 𝗾𝘂𝗲 𝗺𝗲 𝗱𝗶𝗴𝗮𝘀 𝗾𝘂𝗲 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗱𝗲𝗯𝗼 𝘁𝗿𝗮𝗱𝘂𝗰𝗶𝗿',
        '🌐 𝗕𝗶𝗲𝗻, 𝗽𝗲𝗿𝗼 𝗳𝗮𝗹𝘁𝗮 𝗲𝗹 𝘁𝗲𝘅𝘁𝗼 𝗾𝘂𝗲 𝗾𝘂𝗶𝗲𝗿𝗲𝘀 𝗾𝘂𝗲 𝘁𝗿𝗮𝗱𝘂𝘇𝗰𝗮'
    ])
}

function FootHint() {

    return random([
        '> Escribe algo seguido del comando para traducirlo',
        '> Escribe el comando mientras respondes a otro mensaje',
        '> Envia el comando junto a *-error* y veras que respondo a proposito'
    ])
}

export default function getHint() {
    return HeadHint() + '\n\n' + FootHint()
}