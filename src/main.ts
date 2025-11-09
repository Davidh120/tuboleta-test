import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tuboleta API')
    .setDescription('API documentation for Tuboleta application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', 'public'),
    prefix: '/public/',
    decorateReply: !isProduction,
  });

  app.setGlobalPrefix('api', {
    exclude: ['docs', 'public', 'api-json'],
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Tuboleta API',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .scheme-container { display: none !important; }
      .swagger-ui .authorize-wrapper { display: none !important; }
    `,
    customJs: [
      '/public/swagger-ui/swagger-ui-bundle.js',
      '/public/swagger-ui/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: '/public/swagger-ui/swagger-ui.css',
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/docs`);
}

bootstrap().catch(err => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
