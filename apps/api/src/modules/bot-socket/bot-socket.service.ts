import { forwardRef, Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Socket } from "socket.io";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { BotSocketGateway } from "./gateway/bot-socket.gateway";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { WsException } from "@nestjs/websockets";


@Injectable()
export class BotSocketService {

    constructor(

      @Inject( forwardRef( () => BotSocketGateway ) )
      private readonly botSocketGateway: BotSocketGateway

    ) {}


    getSocketUser(client: Socket): ClientRequest {
      return client.data.user as ClientRequest;
    }


    async sendVerificationCode(code: string, uid: string) {

      try {

        const active = await this.botSocketGateway.server.in('BOT').fetchSockets();

        if (active.length === 0) throw new WsException('No hay bots disponibles para el envio del codigo')
          
        const response = await this.botSocketGateway.server
          .to('BOT')
          .timeout(5_000)
          .emitWithAck('code.upsert', { uid, code } )

        console.log(response[0])

        return { statusCode: response[0]?.statusCode, success: true, bot: response?.[0]?.bot, message: response?.[0]?.message }

      } catch (error) {

        throw new ServiceUnavailableException( ERROR_CODE.SERVICE_UNAVAILABLE(error?.message || 'No se puede enviar el codigo por número, servicio no disponible temporalmente') ) 
      }
    }

    
}