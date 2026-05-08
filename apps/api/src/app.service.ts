import { Injectable } from '@nestjs/common';
import { interfaceHealth } from './common/types/health.type';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): interfaceHealth {

    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    return {
      status: "ok",
      version: "0.1",
      latency: "N/A",
      timestamp,
      uptimeMs: uptime,
      uptime: Math.floor(uptime),
      services: {
        database: "N/A",
        whatsapp: "N/A"
      }
    }
  }
}
