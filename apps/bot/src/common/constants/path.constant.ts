import path from 'node:path';

export const ROOT_PATH = path.resolve(import.meta.dirname, '../../../'); 

export const AUTH_PATH = path.resolve(ROOT_PATH, "src", "auth");
export const BOT_AUTH_PATH = (uid: string): string => path.resolve(AUTH_PATH, uid);
export const HEADERS_BOT_AUTH_PATH = (uid: string): string => path.resolve(BOT_AUTH_PATH(uid), 'A.HEADERS.json');