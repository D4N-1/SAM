import { startApi } from "./api-client.ts";
import { Socket } from "socket.io-client";
import EventEmitter from "node:events";
import Logger from "../common/utils/logger.util.ts";
import enumContext from "../common/enums/context.enum.ts";
import WhatsappService from "./whatsapp.service.ts";


export async function startApiSocket(token: string, samSocket:any) {

    const sam = new WhatsappService(samSocket)
    const socket: Socket = startApi(token)
    const localEvent: EventEmitter = new EventEmitter();

    registerConnectionEvents(localEvent, socket, sam);
    registerCodeEvent(socket, sam)
    registerSystemEvent(socket, sam)

    

    socket.on('connect', () => {
        localEvent.emit("connection.update", { statusCode: 200, message: `🟢 [Socket.io Client] Conectado al Gateway NestJS con ID: ${socket.id}` })
    });


    socket.on('disconnect', (reason) => {
        localEvent.emit("connection.update", { statusCode: 410, message: `🔴 [Socket.io Client] Desconectado del Gateway: ${reason}` })
    });

    socket.on('connect_error', (error) => {
        localEvent.emit("connection.update", { statusCode: 412, message: `⚠️ [Socket.io Client] Error de conexión: ${error.message}` });
    });


}


async function registerConnectionEvents(localEvent: EventEmitter, socket: Socket, sam: any) {
    
    localEvent.on("connection.update", async(data: any) => {


        if (data?.statusCode === 200) {
            Logger.log(enumContext.ApiClient, 'SocketApi en ACTIVO')


        } else if (data?.statusCode === 410) Logger.error(enumContext.ApiClient, 'SocketApi DESCONECTADO')
                else if (data?.statusCode === 412) Logger.error(enumContext.ApiClient, 'SocketApi Precondition Failed')

    })

}

async function registerSystemEvent(socket: Socket, sam: WhatsappService) {

    try {


        socket.on('system', async(data) => {

            console.log(data)
        })


    } catch (error) {
        Logger.error(enumContext.ApiClient, 'Systemvent Internal')
        console.error(error)

    }
}


async function registerCodeEvent(socket: Socket, sam: WhatsappService) {

    try {

        socket.on('code.upsert', async (data, ack) => {
            const { uid, code } = data;

            console.log(data)

            await sam.sendMessage(uid + '@s.whatsapp.net', { text: `*AQUI ESTA TU CODIGO*\n\n> ${code}` })

            ack({
                statusCode: 200,
                message: 'Se envió el codigo con exito',
                bot: sam.getMeNumber()
            })
        })


    } catch (error) {
        Logger.error(enumContext.ApiClient, 'CodeEvent Internal')
        console.error(error)
    }
}