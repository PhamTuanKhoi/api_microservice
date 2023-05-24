import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const USER = configService.get<string>('RABBITMQ_USER');
  const PASS = configService.get<string>('RABBITMQ_PASS');
  const HOST = configService.get<string>('RABBITMQ_HOST');
  const QUEUE = configService.get<string>('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASS}@${HOST}`],
      queue: QUEUE,
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen(3000);
}
bootstrap();
