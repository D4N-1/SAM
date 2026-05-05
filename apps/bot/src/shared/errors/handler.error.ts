import { AppError } from "./app.error.js";
import { enumErrorCode } from "./enum.error.js";
import {
  msgERROR_LOG_MESSAGES,
  msgERROR_USER_MESSAGES
} from "../messages/error.message.js";

export async function handleError(error: unknown, ctx: any) {
  let code: enumErrorCode = enumErrorCode.INTERNAL;

  if (error instanceof AppError) {
    code = error.code;
  }

  // LOG
  console.error(msgERROR_LOG_MESSAGES[code](ctx));
  console.error(error);

  // RESPUESTA AL USUARIO
  await ctx.sendMessage(msgERROR_USER_MESSAGES[code](ctx));
}