import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
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
  const IP = `http://127.0.0.1:${PORT} https://api.sambot.live`
  await app.listen(PORT);

  console.log(`Servicio escuchando en ${IP}`)
  console.log(`Documentación disponible en ${IP}/docs`)
}
bootstrap();
