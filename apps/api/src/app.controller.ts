import { Controller, Get, HttpCode, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express'
import { AppService } from './app.service';
import {  ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Obtiene el estado de la API' })
  @ApiOkResponse({ description: 'Recibe el estado del servicio' })
  @Get('/health')
  @HttpCode(200)
  getHealth() {
    return this.appService.getHealth();
  }


  @Get('ip')
  debugIp(@Req() req: Request) {
    return {
      rawIp: req.socket.remoteAddress,
      xForwardedFor: req.headers['x-forwarded-for'], // ¿Llega algo aquí?
      isTrust: req.app.get('trust proxy'),
      ip: req.ip,
      ips: req.ips, // Esto te mostrará la cadena completa (IP cliente, IP proxy)
      headers: req.headers['x-forwarded-for']
    };
  }


  @Get('/image/:id.png')
  async wsPreview(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {

    const agent = (req.headers["user-agent"] || "").toLowerCase();
    const url = req.params.id

    console.log(agent)
    console.log(url)

    const esWhatsapp =
      agent.includes("whatsapp") ||
      agent.includes("whatsapp/") ||
      agent.includes("wa-web") ||
      agent.includes("whats-app");

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });


    if (esWhatsapp) {
      console.log('ES WHATSAPP')
      return res.status(403)
      
    } else return res.redirect('https://sambot.live')

  }


  /*
  app.get("/thumbnail/:id.png", async (req, res) => {

  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const nocache = req.query.nocache || Date.now();
  const url = req.params.id

  console.log(ua)
  console.log(url)

  const esWhatsapp =
    ua.includes("whatsapp") ||
    ua.includes("whatsapp/") ||
    ua.includes("wa-web") ||
    ua.includes("whats-app");

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });

  if (esWhatsapp) {

      res.status(403)
      //res.type(contentType).send(data);
    return;
  }

  return res.redirect("/");
});
*/
}
