import { random } from "../../../common/utils/function.util.js";


function HeadHint() {

    return random([
        '⭕ 𝗧𝗲 𝗳𝗮𝗹𝘁𝗮 𝗲𝗹 \`𝘁𝗲𝘅𝘁𝗼\` 𝗼 \`𝗰𝗼𝗻𝘁𝗲𝗻𝗶𝗱𝗼\` 𝗾𝘂𝗲 𝗱𝗲𝘀𝗲𝗮𝘀 𝗾𝘂𝗲 𝗱𝗶𝗴𝗮',
        '⭕ 𝗖𝗿𝗲𝗼 𝗾𝘂𝗲 𝘁𝗲 𝗳𝗮𝗹𝘁𝗼 𝗱𝗲𝗰𝗶𝗿𝗺𝗲 𝗾𝘂𝗲 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗾𝘂𝗶𝗲𝗿𝗲𝘀 𝗾𝘂𝗲 𝗱𝗶𝗴𝗮',
        '⭕ 𝗛𝗼𝗹𝗮, 𝗲𝘀𝘁𝗼𝘆 𝗮𝗾𝘂𝗶, 𝘀𝗼𝗹𝗼 𝗳𝗮𝗹𝘁𝗮 𝗾𝘂𝗲 𝗺𝗲 𝗱𝗶𝗴𝗮𝘀 𝗾𝘂𝗲 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗱𝗲𝗯𝗼 𝗿𝗲𝗽𝗲𝘁𝗶𝗿',
        '⭕ !𝘀𝗮𝘆.. 𝗲𝘀𝘁𝗼𝘆 𝗯𝗿𝗼𝗺𝗲𝗮𝗻𝗱𝗼, 𝘁𝗲 𝗳𝗮𝗹𝘁𝗼́ 𝗱𝗲𝗰𝗶𝗿𝗺𝗲 𝗾𝘂𝗲 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗱𝗲𝗯𝗼 𝗿𝗲𝗽𝗲𝘁𝗶𝗿'
    ])
}

function FootHint() {

    return random([
        '> Escribe algo seguido de \`!say\` *algo*',
        '> Escribe \`!say\` mientras respondes a otro mensaje y te sorprenderas',
        '> Envia el \`!say\` con una imagen y yo te seguire el juego',
        '> Envia el \`!say\` junto a *-error* y veras que respondo a proposito'
    ])
}

export default function getHint() {
    return HeadHint() + '\n\n' + FootHint()
}