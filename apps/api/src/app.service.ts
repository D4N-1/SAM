import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(
    
  ) {}


  async getHealth() {

    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    const customInfo = {
      version: "0.4",
      uptime: Math.floor(uptime),
      uptimeMs: Math.floor(uptime * 1000),
      timestamp
    };

      return customInfo

  }
}
