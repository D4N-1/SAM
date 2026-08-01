import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { ClsService } from 'nestjs-cls';
import { Socket } from 'socket.io';
import { Private } from 'src/decorators/private.decorator';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export default class WsJwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isPrivate = this.reflector.getAllAndOverride(Private, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPrivate) return true;

    const clientSocket = context.switchToWs().getClient<Socket>();

    let client = clientSocket.data?.user;

    if (!client) {

      const token = 
        clientSocket.handshake?.headers?.cookie ||
        clientSocket.handshake?.auth?.cookie ||
        clientSocket.handshake?.auth?.token;

      if (!token) {
        throw new WsException({
          statusCode: 401,
          message: 'No se proporcionó token de autorización',
        });
      }

      try {
        client = await this.authService.verifyToken(token);
        clientSocket.data.user = client;
      } catch (error) {
        throw new WsException({
          statusCode: 401,
          message: 'Token inválido o expirado',
        });
      }
    }


    return true;
  }
}