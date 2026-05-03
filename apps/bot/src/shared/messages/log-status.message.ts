import type { enumStatusConnection } from "../enums/enum.status.js";

export const msgSTATUS_CONNECTION: Record <enumStatusConnection, string> = {
    connecting: "CONECTANDO...",
    close: "CERRADA",
    open: "ESTABLECIDA"
}

export const msgSTATUS_TITLE = "─────────────── [ ACTUALIZACIÓN DE CONEXIÓN ] ───────────────"