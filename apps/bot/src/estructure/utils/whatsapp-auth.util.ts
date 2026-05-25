import { useMultiFileAuthState } from "@itsukichan/baileys";
import fsAsync from "node:fs/promises";
import fs from "node:fs";
import path from 'node:path'
import { AUTH_PATH } from "../../common/constants/path.constant.js";

export async function createAuthState(uid: string): Promise<{ state: any, saveCreds: any }> {

    if ( !existAuth('') ) fsAsync.mkdir( AUTH_PATH )
    if ( !existAuth(uid) ) fsAsync.mkdir( path.resolve( AUTH_PATH, uid) )

    return await useMultiFileAuthState( path.resolve( AUTH_PATH, uid) )
}

export function existAuth(uid: string): boolean {
    return fs.existsSync( path.resolve( AUTH_PATH, uid) )
}

export async function deleteAuth(uid: string): Promise<void> {

    if ( !existAuth(uid) ) return;

    await fsAsync.rm( path.resolve( AUTH_PATH, uid), {
        recursive: true,
        force: true
    })
}
