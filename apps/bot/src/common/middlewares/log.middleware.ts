import enumMessage from "../enums/type-mesage.enum.js";
import type { CommandContext, NextFunction, SamMiddleware } from "../interfaces/middleware.interface.js";


export class LogMiddleware implements SamMiddleware {
    async use(context: CommandContext, next: NextFunction): Promise<void> {
        
        const { sender, senderAlt, contentType, isGif, chatId, isFromMe, captent,
            isGroup, pushName, timestampDate, quoted, mentionedJid } = context.message;

        //console.log(context.message)

        let type: string;
        if (contentType === enumMessage.imageMessage) type = "📷";
            else if (contentType === enumMessage.videoMessage) type = isGif ? "📟" : "📽️";
                else if (contentType === enumMessage.stickerMessage) type = "📔";
                    //else if (reactMsg) type = "😎"
                        else if (contentType === enumMessage.extendedTextMessage) type = "📄";
                            else type = '¿?'
  


        const text: string | undefined = Number(captent?.length) > 15 ? captent?.slice(0, 15) + '..' : captent;

        console.log(`\n─────────────── [ MESSAGE ] ───────────────`);
        console.log(`[${type}] 🆔  ${chatId} - ${isFromMe ? "🤖" : "👤"} ${senderAlt||sender}: ${text||''}`); 
        console.log(`${isGroup? '🔰' : ''} - - ${pushName} - ⏳ ${timestampDate}`);

        if (quoted.qSender) console.log(`↩️  ${quoted.qSender}:  ${quoted.qCaptent}`);
        if (mentionedJid) console.log(`🗣️  ${mentionedJid}`);

        await next();
    }
}