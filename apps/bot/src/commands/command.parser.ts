

export function parseCommand(text: string) {

    if (!text?.startsWith("!")) return null

    const [ command, ...args ] = text.slice(1).trim().split(/\s+/)

    if (!command) return null;
    
    return {
        command: command.toLowerCase(),
        args
    }
}