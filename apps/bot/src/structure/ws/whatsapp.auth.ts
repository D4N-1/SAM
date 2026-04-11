import { useMultiFileAuthState } from "@itsukichan/baileys";
import path from "node:path";

export async function createAuthState() {
    return useMultiFileAuthState( path.resolve("auth") )
}