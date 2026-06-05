import { Api } from '../../common/utils/api.util.js';
import { BufferJSON, initAuthCreds, proto } from '@itsliaaa/baileys';
import Logger from '../../common/utils/logger.util.js';

export const useApiAuthState = async (botUid: string) => {


    const writeData = async (key: string, value: any) => {
        try {


            const string = JSON.stringify( value, BufferJSON.replacer )
            
            await Api.post('/bots/auth', {
                botUid: botUid,
                key: key,
                value: string
            });

        } catch (error:any) {
            console.error(`Error escribiendo ${key}:`, error);
            return null;
        }
    };
    
    const readData = async (key: string) => {
        try {

            const response = await Api.get(`/bots/auth/${botUid}/${key}`);

            const data = response.data;
            if (response.status !== 200 || !data) return null;

            const value = JSON.parse(data.value, BufferJSON.reviver);
            return value;
        } catch (error) {
            console.error(`Error leyendo ${key}:`, error);
            return null;
        }
    };

    const removeData = async (key: string) => {
        try {

            await Api.del(`/bots/auth/${botUid}/${key}`)

        } catch { }
    }


    const creds = ( await readData('creds') ) || initAuthCreds();
    return {
        state: {

            creds, 
            keys: {
                get: async (type: string, ids: string[]) => {
                    const data: any = {};

                    await Promise.all(ids.map( async(id) => {
                        
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = proto.Message.AppStateSyncKeyData.fromObject(value);
                        }

                        data[id] = value;

                    }));
                    return data;
                },

                set: async (data: any) => {
                    for (const type in data) {
                        for (const id in data[type]) {
                            const value = data[type][id];
                            const key = `${type}-${id}`;
                            // Cambia esto: tasks.push(...)
                            // Por esto (await directo):
                            await (value ? writeData(key, value) : removeData(key));
                        }
                    }
                }
            }
        },

        saveCreds: async () => {
            return writeData('creds', creds)
        }
    }
}