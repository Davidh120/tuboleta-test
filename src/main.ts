import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Tuboleta API')
    .setDescription('API documentation for Tuboleta application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'node_modules', 'swagger-ui-dist'),
    prefix: '/swagger-ui/',
  });
  const fastifyInstance = app.getHttpAdapter().getInstance();
  
  fastifyInstance.get('/swagger-ui/swagger-ui.css', (req, reply) => {
    reply.sendFile('swagger-ui.css');
  });
  fastifyInstance.get('/swagger-ui/swagger-ui-bundle.js', (req, reply) => {
    reply.sendFile('swagger-ui-bundle.js');
  });

  fastifyInstance.get('/swagger-ui/swagger-ui-standalone-preset.js', (req, reply) => {
    reply.sendFile('swagger-ui-standalone-preset.js');
  });
  app.setGlobalPrefix('api', {
    exclude: ['docs', 'swagger-ui', 'api-json', 'docs-json'],
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
      .swagger-ui .scheme-container {
        display: none !important;
      }
      .swagger-ui .authorize-wrapper {
        display: none !important;
      }
    `,
    customJs: [
      '/swagger-ui/swagger-ui-bundle.js',
      '/swagger-ui/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: '/swagger-ui/swagger-ui.css',
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
}

bootstrap();
