import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CORS_config } from "src/main";
import { AuthService } from "src/modules/auth/auth.service";
import { BotSocketService } from "../bot-socket.service";
import { enumBotRole } from "src/common/enums/bot-role.enum";
import { forwardRef, Inject } from "@nestjs/common";


const SocketCORS_config = {
    ...CORS_config,
    path: '/bots/socket.io'
}


@WebSocketGateway(SocketCORS_config)
export class BotSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(

        @Inject(forwardRef( () => BotSocketService))
        private readonly botSocketService: BotSocketService,

        @Inject( forwardRef( () => AuthService) )
        private readonly authService: AuthService

    ) {}


    @WebSocketServer()
    server: Server;


    afterInit(server: Server) {

        server.use(async (client: Socket, next) => {
            try {

                console.log(`Cliente: ${client.id}`)

                const token = client?.handshake?.headers?.cookie ||
                    client?.handshake?.auth?.cookie;
            

                if (!token) return next( new Error('No se proporcionó un token de acceso') )
            

                client.data.user = await this.authService.verifyToken(token);

                next();

            } catch (error) {
                next( new Error('El token proporcionado es inválido') )
            }
        })

    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log(`Cliente conectado: ${client.id}`)

        const user = this.botSocketService.getSocketUser(client);
        console.log(user)

        if (user.role === enumBotRole.BOT) client.join('BOT')


        setTimeout(() => {

            client.emit('system', { statusCode: 200, message: 'Conexión establecida' } )

            if (user.role === enumBotRole.BOT) client.emit('system', { statusCode: 201, message: 'Se te ha unido a la SALA "BOT"' })

        }, 1_000)

    }

    handleDisconnect(client: Socket) {
        console.log(`Cliente desconectado: ${client.id}`)
    }


    @SubscribeMessage('start')
    event(@ConnectedSocket() socket: Socket) {
        console.log(socket.data?.user)

        socket.emit('start', { message: `Hola ${socket?.data?.user?.name}` })
    }
}