import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { ClsService } from "nestjs-cls";
import { Socket } from "socket.io";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { Private } from "src/decorators/private.decorator";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {

    constructor(
        private readonly cls: ClsService,
        private readonly reflector: Reflector,
        private readonly authService: AuthService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {


        const isPublic = this.reflector.getAllAndOverride(Public, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) return true;

        const isPrivate = this.reflector.getAllAndOverride(Private, [
            context.getHandler(),
            context.getClass()
        ])


        if (!isPrivate) return true;

        if (context.getType() === 'ws') return this.handleWsContext(context);
    
        const canActivate = await super.canActivate(context);

        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const client: ClientRequest = request.user;

        if (client) {
            this.cls.set('userType', client.type);
            this.cls.set('userId', client.uuid);
        }

        return canActivate as boolean
    }


    private async handleWsContext(context: ExecutionContext): Promise<boolean> {
        const clientSocket = context.switchToWs().getClient<Socket>();
    
        let client = clientSocket.data?.user;

        if (!client) {
            const token = 
                clientSocket.handshake?.headers?.cookie ||
                clientSocket.handshake?.auth?.cookie ||
                clientSocket.handshake?.auth?.token;

            if (!token) throw new WsException({ statusCode: 401, message: 'No se proporcionó token' });
        

            try {
                client = await this.authService.verifyToken(token);
                clientSocket.data.user = client;
            } catch (err) {
              throw new WsException({ statusCode: 401, message: 'Token inválido' });
            }
        }

        return true;
  }

}