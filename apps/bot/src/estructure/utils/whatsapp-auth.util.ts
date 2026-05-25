import { useMultiFileAuthState } from "@itsukichan/baileys";
import fsAsync from "node:fs/promises";
import fs from "node:fs";
import { AUTH_PATH, BOT_AUTH_PATH } from "../../common/constants/path.constant.js";

export async function createAuthState(uid: string): Promise<{ state: any, saveCreds: any }> {

    if ( !existAuth('') ) fsAsync.mkdir( AUTH_PATH )
    if ( !existAuth(uid) ) fsAsync.mkdir(BOT_AUTH_PATH(uid))

    return await useMultiFileAuthState( BOT_AUTH_PATH(uid) )
}

export function existAuth(uid: string): boolean {
    return fs.existsSync( BOT_AUTH_PATH(uid) )
}

export async function deleteAuth(uid: string): Promise<void> {

    if ( !existAuth(uid) ) return;

    await fsAsync.rm( BOT_AUTH_PATH(uid), {
        recursive: true,
        force: true
    })
}
