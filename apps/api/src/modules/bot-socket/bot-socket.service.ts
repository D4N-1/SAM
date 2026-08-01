import { forwardRef, Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Socket } from "socket.io";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { BotSocketGateway } from "./gateway/bot-socket.gateway";
import { ERROR_CODE } from "src/common/utils/error.utils";


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

        const response = await this.botSocketGateway.server
          .to('BOT')
          .timeout(5_000)
          .emitWithAck('code.upsert', { uid, code } )

        console.log(response)

        return { success: true, message: response?.message }

      } catch (error) {

        throw new ServiceUnavailableException( ERROR_CODE.SERVICE_UNAVAILABLE('No se puede enviar el codigo, servicio no disponible temporalmente') ) 
      }
    }

    
}