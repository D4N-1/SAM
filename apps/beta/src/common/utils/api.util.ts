import axios from "axios";
import Logger from "./logger.util.js";


declare module "axios" {
    export interface AxiosRequestConfig {
        uid?: string
    }
}


export const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:82',
    timeout: 5_000,
    validateStatus: () => true
})


export const Api = {
    get: (url:string, config?:any) => apiInstance.get(url, config),
    post: (url: string, data: any, config?: any) => apiInstance.post(url, data, config),
    patch: (url: string, data: any, config?: any) => apiInstance.patch(url, data, config),

    setToken: (token: string) => {
        apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}
