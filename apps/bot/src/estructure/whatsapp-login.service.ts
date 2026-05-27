import enumContext from "../common/enums/context.enum.js";
import { Api } from "../common/utils/api.util.js";
import { wait } from "../common/utils/function.util.js";
import Logger from "../common/utils/logger.util.js";
import { editHeaders, saveHeaders } from "./utils/api-headers.util.js";

export class ApiLoginService {
    private readonly MAX_RETRIES = 15;
    private readonly DELAY = 10_000;


    public async getApiStatus(): Promise<boolean> {
        try {
            const res = await Api.get('/health');
            return res.status >= 200 && res.status <= 300;
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
        Logger.error(enumContext.WhatsappLoginService, `Bot no registrado: ${number}`)
        return null;

        } catch (error) {
            Logger.error(enumContext.WhatsappLoginService, 'Obtener token auth')
            //console.error('Error al obtener el token de autenticación');
            return null;
        }
    }

    async getMe(uid: string): Promise<boolean|null> {
        try {
            if (!uid) return null;

            const res = await Api.get('/auth/me', { uid });

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

            const me = await this.getMe(uid)
            if (me) return true;

            Logger.log(enumContext.WhatsappLoginService, 'Generando un nuevo TOKEN')
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