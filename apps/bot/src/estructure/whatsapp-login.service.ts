import { Api } from "../common/utils/api.util.js";


export const WhatsappLogin = {

    get: {

        async getApiStatus() {
            try {
                const res = await Api.get('/health');
                return res.data;
            } catch (error) {
                console.error('Error al obtener el estado de la API:', error);
                return null;
            }
        },
    
        async getAuthToken(number: string, code: string): Promise<string | null> {
            try {
                const res = await Api.post(`/auth/bot/login`, {
                    contactUid: number,
                    code
                });

                if (res.status !== 201) return null;
                return res.data?.access_token || null;

            } catch (error) {
                console.error('Error al obtener el token de autenticación:', error);
                return null;
            }
        }
    }
};