import axios from "axios";
import { editHeaders } from "../../estructure/utils/api-headers.util.js";
import Logger from "./logger.util.js";


declare module "axios" {
    export interface AxiosRequestConfig {
        uid?: string
    }
}


export const Api = axios.create({
    baseURL: 'http://127.0.0.1:82',
    timeout: 5_000,
    validateStatus: () => true
})

Api.interceptors.request.use(
    async (config) => {

        try {

            const uid = config?.uid;
            if (!uid) return config;

            const HEADERS = await editHeaders(uid);
            //console.log(HEADERS)
            if (!HEADERS.token) return config;

            config.headers['Authorization'] = `Bearer ${HEADERS.token}`;

        } catch (error) {
            Logger.error('ApiUtil', 'Inyectar el token guardado en interceptor')
            console.error(error)
        } finally {
            return config;
        }
    }
)