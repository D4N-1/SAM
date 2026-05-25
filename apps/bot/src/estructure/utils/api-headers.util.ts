import fsAsync from 'node:fs/promises';
import fs from 'node:fs'
import { existAuth } from './whatsapp-auth.util.js';
import path from 'node:path';
import { AUTH_PATH } from '../../common/constants/path.constant.js';

export async function editHeaders(uid: string): Promise<any> {
    const headersPath = path.resolve( AUTH_PATH, uid, 'A.HEADERS.json' );

    if (!fs.existsSync(headersPath)) await fsAsync.writeFile(headersPath, JSON.stringify({}), 'utf-8');

    const content = await fsAsync.readFile(headersPath, 'utf-8');
    return JSON.parse(content);
}

export async function saveHeaders(uid: string, data: any): Promise<void> {
    if (!existAuth(uid)) return; 

    const filePath = path.resolve( AUTH_PATH, uid, 'A.HEADERS.json');
    
    await fsAsync.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}