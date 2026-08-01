import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class CustomWsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const errorPayload = exception.getError();

    let statusCode = 400;
    let message = 'Error en la petición WebSocket';

    if (typeof errorPayload === 'object' && errorPayload !== null) {
      statusCode = (errorPayload as any).statusCode || 400;
      message = (errorPayload as any).message || message;
    } else if (typeof errorPayload === 'string') {
      message = errorPayload;
    }

    client.emit('exception', {
      statusCode,
      error: this.getHttpErrorName(statusCode),
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private getHttpErrorName(code: number): string {
    const errors: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };
    return errors[code] || 'Bad Request';
  }
}