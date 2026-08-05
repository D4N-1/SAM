import { io } from "socket.io-client"
import Logger from "../common/utils/logger.util.ts"
import enumContext from "../common/enums/context.enum.ts"

const SERVER_URL = 'https://api.sambot.live'


export function startApi(token:string) {
    try {

        return io(SERVER_URL, {
            path: '/bots/socket.io',
            transports: [ 'websocket' ],
            transportOptions: {
                websocket: {
                    Headers: {
                        cookie: `${token}`
                    }
                }
            },
            auth: {
                cookie: `${token}`
            }
        })

    } catch (error: any) {
        Logger.error(enumContext.ApiClient, error.message, error)
    }
}
