import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientKnownRequestExceptionFilter } from './errors/prisma-client-exception/prisma-client-known-request-exception.filter';
import { PrismaClienValidationtExceptionFilter } from './errors/prisma-client-exception/prisma-client-validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Tech Blog API')
    .setDescription('This is a sample Tech Blog API.')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientKnownRequestExceptionFilter(httpAdapter),
  );
  app.useGlobalFilters(new PrismaClienValidationtExceptionFilter(httpAdapter));

  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
