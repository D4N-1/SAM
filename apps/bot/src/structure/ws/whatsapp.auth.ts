import { useMultiFileAuthState } from "@itsukichan/baileys";
import path from "node:path";
import fsAsync from "node:fs/promises";
import fs from "node:fs";
import { BOT_PATH } from "../../common/utils/bot_path.util.js";

const AUTH_PATH: string = path.resolve( BOT_PATH, "src", "auth" )

export async function createAuthState() {

    if (!existAuth()) fsAsync.mkdir(AUTH_PATH)

    return await useMultiFileAuthState( AUTH_PATH )
}

export function existAuth() {
    return fs.existsSync( AUTH_PATH )
}

export async function deleteAuth() {
    await fsAsync.rm( AUTH_PATH, {
        recursive: true,
        force: true
    })

    return
}