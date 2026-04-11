

export interface contextCommand {
    socket: any,
    chatId: string;
    sender: string;
    rawMessage: any;
    reply(content: string): Promise<void>
}