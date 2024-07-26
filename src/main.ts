import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('SophenIA API')
    .setDescription('SophenIA API description')
    .addBearerAuth({ type: 'http', name: 'access-token' }, 'access-token')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8080;

  await app.listen(port);

  Logger.verbose(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
