import { AppError } from "../../../common/errors/app.error.js";
import { enumErrorCode } from "../../../common/errors/enum.error.js";
import { wait } from "../../../common/utils/function.util.js";
import type { WhatsappService } from "../../../estructure/whatsapp.service.js";
import type { interMessage } from "../../../messages/msg.types.js";
import type { interCommand } from "../../command.interface.js";
import { enumPingStates } from "./ping.enums.js";
import { getPingMessage } from "./ping.utils.js";

export class PingCommand implements interCommand {
    name = "ping";
    aliases = ["p", "pong"];

    async execute(message: interMessage, whatsapp: WhatsappService): Promise<void> {

        await whatsapp.readMessage( message.key )

        const start = Date.now();
        const start_text = getPingMessage( enumPingStates.CALCULANDO );

        if (!start_text) throw new AppError( enumErrorCode.MESSAGE_NOT_FOUND );

        const sentMessage = await whatsapp.send.text( message.chatId, start_text );
        const end = Date.now();

        const diff = end - start;

        await wait(300)
        await whatsapp.sendPresenceUpdate('composing', message.chatId)
        await wait(2_500);

        const end_message = getPingMessage(enumPingStates.CALCULADO, diff);
        if (!start_text) throw new AppError(enumErrorCode.MESSAGE_NOT_FOUND);
        await whatsapp.editMessage(message.chatId, end_message, sentMessage.key );

        await whatsapp.sendPresenceUpdate('paused', message.chatId)

    }
}