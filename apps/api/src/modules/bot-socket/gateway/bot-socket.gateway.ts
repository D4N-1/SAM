import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CORS_config } from "src/main";
import { AuthService } from "src/modules/auth/auth.service";


const SocketCORS_config = {
    ...CORS_config,
    path: '/socket.io'
}


@WebSocketGateway(SocketCORS_config)
export class BotSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(

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
            

                client.data.user = await this.authService.verifyToken(token)

                next();

            } catch (error) {
                next( new Error('El token proporcionado es inválido') )
            }
        })

    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log(`Cliente conectado`)

        setTimeout(() => {
            client.emit('system', { statusCode: 200, message: 'Conexión establecida' } )
        }, 1_000)

    }

    handleDisconnect(client: Socket) {
        console.log(`Cliente desconectado: ${client.id}`)
    }


    @SubscribeMessage('start')
    event(@ConnectedSocket() socket: Socket) {
        console.log(socket.data?.user)
    }
}