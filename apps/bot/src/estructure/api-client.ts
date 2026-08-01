import { io, Socket } from "socket.io-client"

const SERVER_URL = 'https://api.sambot.live'


export function startApi(token:string) {

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
}
