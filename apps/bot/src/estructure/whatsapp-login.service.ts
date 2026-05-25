import { Api } from "../common/utils/api.util.js";
import { Logger } from "../common/utils/logger.util.js";
import { editHeaders, saveHeaders } from "./utils/api-headers.util.js";

export const ApiLogin = {

    get: {

        async apiStatus(): Promise<true|false> {
            try {
                await Api.get('/health');
                return true;
            } catch (error) {
                console.error('Error al obtener el estado de la API:', error);
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
                console.error('Error al obtener el token de autenticación:', error);
                return null;
            }
        }
    },


    async signIn(uid: string, code: string): Promise<true|false|undefined> {

        try {

            const isOnline = await ApiLogin.get.apiStatus()
            if ( !isOnline ) return false;

            const token = await ApiLogin.get.authToken(uid, code);
            console.log(token)
            if (!token) return false;

            const HEADERS = await editHeaders(uid);
            HEADERS.token = token;

            await saveHeaders(uid, HEADERS);
            return true;

        } catch (error) {
            Logger('signIn Service', 'Error', null, true)
            console.error(error)
        }
    }
};