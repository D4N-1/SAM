import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  const config = new DocumentBuilder()
    .setTitle('Sam - API')
    .addBearerAuth()
    .setDescription('Documentacion basica sobre el uso de esta API')
    .setVersion('1.0')
    .addTag('animes')
    .addTag('genders')
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
  
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Servicio escuchando en el puerto ${process.env.PORT ?? 3000}`)
}
bootstrap();
