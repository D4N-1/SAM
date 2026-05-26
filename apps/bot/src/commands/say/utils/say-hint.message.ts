import { random } from "../../../common/utils/function.util.js";
import hint from "./say-hint.messages.json" with { type: 'json' }


function HeadHint() {

    return random(hint.header)
}

function FootHint() {

    return random(hint.footer)
}

export default function getHint() {
    return HeadHint() + '\n\n' + FootHint()
}