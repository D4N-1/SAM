export function random <T> (arr: T[]): T | undefined {
    if (!arr.length) return undefined;
    return arr[Math.floor( Math.random() * arr.length)];
}