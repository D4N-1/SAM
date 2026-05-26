import enumContext from "../common/enums/context.enum.js";
import { Api } from "../common/utils/api.util.js";
import { wait } from "../common/utils/function.util.js";
import Logger from "../common/utils/logger.util.js";
import { editHeaders, saveHeaders } from "./utils/api-headers.util.js";

export class ApiLoginService {
    private readonly MAX_RETRIES = 5;
    private readonly DELAY = 10_000;


    public async getApiStatus(): Promise<boolean> {
        try {
            await Api.get('/health');
            return true;
        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'API offline')
            //console.error('Error al obtener el estado de la API');
            return false;
        }
    }

    
    async getAuthToken(number: string, code: string): Promise<string | null> {
        try {

        const res = await Api.post(`/auth/bot/login`, {
            contactUid: number,
            code: code
        });

        if ([200, 201].includes( res.status )) return res.data?.access_token;
        return null;

        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'Obtener token auth')
            //console.error('Error al obtener el token de autenticación');
            return null;
        }
    }

    async getMe(token: string|undefined): Promise<boolean|null> {
        try {
            if (!token) return null;

            const res = await Api.get('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if ([200, 201].includes( res.status )) return true;
            return null;

        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'Verificación de token')
            return null;
        }
    }

    async signIn(uid: string, code: string): Promise<true|false> {
        try {

            let isOnline: boolean = false;
            let ATTEMPTS: number = 0;

            while(!isOnline) {
                ATTEMPTS++;

                isOnline = await this.getApiStatus()

                if (!isOnline) {
                    if (ATTEMPTS >= this.MAX_RETRIES) {
                        Logger.error(enumContext.WhatsappLoginService, 'API sin respuesta definitiva')
                        return false;

                    } else {
                        Logger.error(enumContext.WhatsappLoginService, 'API sin respuesta, reintentando...')
                        await wait(this.DELAY)
                    }
                }
                
            }

            const HEADERS = await editHeaders(uid);
            const token = HEADERS.token;

            if ( await this.getMe(token) ) return true;

            const newToken = await this.getAuthToken(uid, code);
            if (!newToken) return false;

            HEADERS.token = newToken;
            await saveHeaders(uid, HEADERS);

            return true;

        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'SignIn')
            //console.error(error)
            return false;
        }
    }
};

const apiLoginService = new ApiLoginService()
export default apiLoginService