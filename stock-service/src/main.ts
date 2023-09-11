import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger: ['error', 'warn', 'log'],
      transport: Transport.TCP,
      options: {
        host: 'stock-services',
        port: 3000,
      },
    },
  );
  await app.listen();
}
bootstrap();
