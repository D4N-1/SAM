import enumContext from "../common/enums/context.enum.js";
import { Api } from "../common/utils/api.util.js";
import { wait } from "../common/utils/function.util.js";
import Logger from "../common/utils/logger.util.js";
import { editHeaders, saveHeaders } from "./utils/api-headers.util.js";

export const ApiLogin = {

    get: {

        async apiStatus(): Promise<true|false> {
            try {
                await Api.get('/health');
                return true;
            } catch (error) {
                Logger.error(enumContext.WhatsappLoginService, 'API offline')
                //console.error('Error al obtener el estado de la API');
                return false;
            }
        },
    
        async authToken(number: string, code: string): Promise<string | null> {
            try {

                const res = await Api.post(`/auth/bot/login`, {
                    contactUid: number,
                    code: code
                });

                if (![200, 201].includes( res.status )) return null;
                return res.data?.access_token || null;

            } catch (error) {
                Logger.error(enumContext.WhatsappLoginService, 'Obtener token auth')
                //console.error('Error al obtener el token de autenticación');
                return null;
            }
        }
    },


    async signIn(uid: string, code: string): Promise<true|false|undefined> {

        try {

            const MAX_RETRIES: number = 5;
            const DELAY: number = 10_000;
            let isOnline: boolean = false;
            let ATTEMPTS: number = 0;

            while(!isOnline) {
                ATTEMPTS++;

                isOnline = await ApiLogin.get.apiStatus()

                if (!isOnline) {
                    if (ATTEMPTS >= MAX_RETRIES) {
                        Logger.error(enumContext.WhatsappLoginService, 'API sin respuesta definitiva')
                        return false;
                    } else {
                        Logger.error(enumContext.WhatsappLoginService, 'API sin respuesta, reintentando...')
                        await wait(DELAY)
                    }
                }
                
            }

            const token = await ApiLogin.get.authToken(uid, code);
            if (!token) return false;

            const HEADERS = await editHeaders(uid);
            HEADERS.token = token;

            await saveHeaders(uid, HEADERS);
            return true;

        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'SignIn')
            //console.error(error)
        }
    }
};