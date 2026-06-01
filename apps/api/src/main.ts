import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express'
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))


  app.use( json({ limit: '10mb' } ) )
  app.use( urlencoded({ extended: true, limit: '10mb' } ) )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Sam - API')
    .addBearerAuth()
    .setDescription('Documentacion basica sobre el uso de esta API')
    .setVersion('1.0')
    .build()

  
  const document = SwaggerModule.createDocument(app, config)
  const SwaggerOptions = {
    customSiteTitle: 'Sambot API Docs',
    customfavIcon: 'https://sambot.live/favicon.ico',
    customhead: `
      <meta property="og:title" content="Sambot API Documentation" />
      <meta property="og:description" content="Explora los endpoints de mi API de Animes desarrollada con NestJS." />
      <meta property="og:image" content="https://sambot.live/images/preview.jpg" />
      <meta property="og:url" content="https://api.sambot.live/docs" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    `,
  }

  SwaggerModule.setup('docs', app, document, SwaggerOptions)
  
  const PORT = process.env.PORT ?? 3000;
  const LOCAL = `http://127.0.0.1:${PORT}`
  const DNS = 'https://api.sambot.live'
  await app.listen(PORT);

  console.log(`Servicio escuchando en ${LOCAL} - ${DNS}`)
  console.log(`Documentación disponible en ${LOCAL}/docs - ${DNS}/docs`)
}
bootstrap();
