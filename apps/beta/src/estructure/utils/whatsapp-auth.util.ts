import { Api } from '../../common/utils/api.util.js';
import type { AuthenticationState } from '@itsukichan/baileys';
import { BufferJSON, initAuthCreds } from '@itsukichan/baileys';
import Logger from '../../common/utils/logger.util.js';

export const useApiAuthState = async (botUid: string) => {
    
    const loadData = async (key: string) => {
        try {
            const response = await Api.get(`/bots/auth/${botUid}/${key}`);
            
            if (response.status !== 200) return null;
            
            const rawData = response.data;
            const jsonString = typeof rawData === 'string' ? rawData : JSON.stringify(rawData);

            return JSON.parse( jsonString, BufferJSON.reviver )
        } catch (error) {
            return null; 
        }
    };

    const saveData = async (key: string, value: any) => {
        try {
            await Api.post('/bots/auth', {
                botUid: botUid,
                key: key,
                value: value
            });
        } catch (error:any) {
            Logger.error('WhatsAppAuth', `Error guardando la llave [${key}] en la API`);
        }
    };

    const state: AuthenticationState = {

        creds: await loadData('creds') || initAuthCreds(), 
        keys: {
            get: async (type, ids) => {
                const data: { [_: string]: any } = {};
                for (const id of ids) {
                    data[id] = await loadData(`${type}-${id}`);
                }
                return data;
            },
            set: async (data: any) => {
                for (const type in data) {
                    for (const id in data[type]) {
                        await saveData(`${type}-${id}`, data[type][id]);
                    }
                }
            }
        }
    };

    return {
        state,
        saveCreds: async () => {
            await saveData('creds', state.creds);
        }
    };
};