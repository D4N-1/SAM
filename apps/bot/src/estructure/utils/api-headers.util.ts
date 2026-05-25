import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import { existAuth } from './whatsapp-auth.util.js';
import { BOT_AUTH_PATH, HEADERS_BOT_AUTH_PATH } from '../../common/constants/path.constant.js';

export function existHeaders(uid: string): boolean {
    return fs.existsSync(HEADERS_BOT_AUTH_PATH(uid));
}

export async function editHeaders(uid: string): Promise<any> {
    const filePath = HEADERS_BOT_AUTH_PATH(uid);
    const folderPath = BOT_AUTH_PATH(uid);

    if (!existHeaders(uid)) {
        await fsAsync.mkdir(folderPath, { recursive: true });
        await fsAsync.writeFile(filePath, JSON.stringify({}), 'utf-8');
    }

    const content = await fsAsync.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

export async function saveHeaders(uid: string, data: any): Promise<void> {
    if (!existAuth(uid)) return; 

    const filePath = HEADERS_BOT_AUTH_PATH(uid);
    
    await fsAsync.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}