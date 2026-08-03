import { NestMiddleware, Injectable } from "@nestjs/common";
import logRegister from "src/common/utils/logger.util";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'refresh_token'];

  use(req: any, res: any, next: (error?: any) => void) {
    const startTime = Date.now();
    const { method, originalUrl, body, ip } = req;

    // Interceptamos la respuesta de forma segura
    const originalSend = res.send;
    let responseBody: any = null;

    res.send = function (chunk: any) {
      if (chunk) {
        try {
          const stringData = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : chunk;
          responseBody = typeof stringData === 'string' ? JSON.parse(stringData) : stringData;
        } catch {
          responseBody = '[Non-JSON Response]';
        }
      }
      return originalSend.apply(res, arguments as any);
    };

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      // Sanitizar Payload (REQ)
      const sanitizedPayload = body && Object.keys(body).length > 0 ? this.sanitize(body) : null;

      // Sanitizar Response (RES)
      const sanitizedResponse = responseBody ? this.sanitize(responseBody) : null;

      // Unificar datos contextuales
      const meta: Record<string, any> = {};
      if (sanitizedPayload) meta.payload = sanitizedPayload;
      if (sanitizedResponse && (statusCode >= 400 || ['POST', 'PUT', 'PATCH'].includes(method))) {
        meta.response = sanitizedResponse;
      }

      // Estructura limpia de log
      const logMessage = `[${method}] ${originalUrl} -> ${statusCode} (${duration}ms) - ${ip}`;
      const hasMeta = Object.keys(meta).length > 0;

      if (statusCode >= 500) {
        logRegister.error(logMessage, hasMeta ? meta : undefined);
      } else if (statusCode >= 400) {
        logRegister.warn(logMessage, hasMeta ? meta : undefined);
      } else {
        // Ahora pasa meta en POST/PUT/PATCH exitosos
        logRegister.info(logMessage);
      }
    });

    next();
  }

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.sanitize(item));

    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (this.sensitiveKeys.includes(key.toLowerCase())) {
        cleanObj[key] = '***';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        cleanObj[key] = this.sanitize(obj[key]);
      } else {
        cleanObj[key] = obj[key];
      }
    }
    return cleanObj;
  }
}