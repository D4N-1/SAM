import { NestMiddleware, Injectable } from "@nestjs/common";
import logRegister from "src/common/utils/logger.util";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    use(req: any, res: any, next: (error?: any) => void) {

        const startTime = Date.now();

        const { method, originalUrl, body, ip } = req;

        const originalSend = res.send;
        let responseBody: any;

        res.send = function (chunk: any) {
            try {
                responseBody = JSON.parse(chunk);
            } catch (e) {
                responseBody = chunk;
            }
            return originalSend.apply(res, arguments);
        };

        res.on('finish', () => {

            const duration = Date.now() - startTime;
            const { statusCode } = res;

            const sanitizeBody = { ...body };
            if (sanitizeBody.password) sanitizeBody.password = '***';

            const logData = {
                method,
                url: originalUrl,
                status: statusCode,
                duration: `${duration}ms`,
                payload: Object.keys(sanitizeBody).length > 0 ? sanitizeBody : null,
                response: responseBody
            }

            const logMessage = `[${method}] ${originalUrl} | ${statusCode} | ${ip} | Time: ${duration} ms`;

            if (statusCode >= 400) {
                logRegister.warn(logMessage, logData)
            } else logRegister.info(logMessage)

        })

        next()
    }
}