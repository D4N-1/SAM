import { startApi } from "./api-client.ts";
import { Socket } from "socket.io-client";
import EventEmitter from "node:events";
import Logger from "../common/utils/logger.util.ts";
import enumContext from "../common/enums/context.enum.ts";
import WhatsappService from "./whatsapp.service.ts";


export async function startApiSocket(token: string, samSocket:any) {

    const sam = new WhatsappService(samSocket)
    const socket: Socket|undefined = startApi(token)
    if (!socket) throw new Error('No se pudo inicializar el SOCKET client');
    
    const localEvent: EventEmitter = new EventEmitter();

    registerConnectionEvents(localEvent, socket, sam);
    registerCodeEvent(socket, sam)
    registerSystemEvent(socket, sam)

    

    socket.on('connect', () => {
        localEvent.emit("connection.update", {
            statusCode: 200,
            message: `[ API CLIENT ] Conectado al Gateway NestJS con ID: ${socket.id}`
        })
    });


    socket.on('disconnect', (reason) => {
        localEvent.emit("connection.update", {
            statusCode: 410,
            error: new Error(`[ API CLIENT ] Desconectado del Gateway: ${reason}`),
        })
    });

    socket.on('connect_error', (error) => {
        localEvent.emit("connection.update", {
            statusCode: 412,
            error
        });
    });


}


async function registerConnectionEvents(localEvent: EventEmitter, socket: Socket, sam: any) {

    try {
    
        localEvent.on("connection.update", async(data: { statusCode: number, message?: string, error: Error }) => {


            if (data?.statusCode === 200) Logger.log(enumContext.ApiClient, 'SocketApi en ACTIVO')
                else if (data?.statusCode === 410 || data?.statusCode === 412) {
                    const err = data?.error ?? new Error(data.message ?? 'Error de conexión desconocido');

                    Logger.error(enumContext.ApiEvents, err.message, err)
                }

        })


    } catch (error: any) {
        console.error(error)
    }

}

async function registerSystemEvent(socket: Socket, sam: WhatsappService) {

    try {


        socket.on('system', async(data) => {

            console.log(data)
        })


    } catch (error) {
        Logger.error(enumContext.ApiEvents, 'Systemevent Internal')
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
        Logger.error(enumContext.ApiEvents, 'CodeEvent Internal')
        console.error(error)
    }
}