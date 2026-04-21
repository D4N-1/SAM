export function ensureExists<T> (res: T | null | undefined, error: Error): T {
    if (res === null || res == undefined) throw error;
    return res as T
}