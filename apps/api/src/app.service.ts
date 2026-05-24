import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class AppService {

  constructor(

    private readonly healthService: HealthCheckService,
    private readonly httpService: HttpHealthIndicator,
    private readonly databaseService: TypeOrmHealthIndicator

  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    const customInfo = {
      version: "0.4",
      uptime: Math.floor(uptime),
      uptimeMs: Math.floor(uptime * 1000),
      timestamp
    };

    // Variables para guardar las latencias exactas
    let dbLatency = 0;
    let wsLatency = 0;

    try {
      const result = await this.healthService.check([
        // 1. Medir Base de datos
        async () => {
          const start = Date.now();
          const res = await this.databaseService.pingCheck('database', { timeout: 3000 });
          dbLatency = Date.now() - start;
          return res;
        },

        // 2. Medir WhatsApp
        async () => {
          const start = Date.now();
          const res = await this.httpService.pingCheck('whatsapp', 'https://api.whatsapp.com');
          wsLatency = Date.now() - start;
          return res;
        }
      ]);

      // Inyectamos las latencias calculadas en el objeto final
      result.details.database['latency'] = dbLatency;
      result.details.whatsapp['latency'] = wsLatency;


      return {
        info: customInfo,
        result
      };

    } catch (error) {
      // Si falla, el error de Terminus suele incluir la duración del que falló,
      // pero por si acaso, también aseguramos que tu formato no se rompa:
      const errorResult = error.response;

      return {
        info: customInfo,
        result: errorResult
      };
    }
  }
}
