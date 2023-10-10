import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('dashboard');
  await app.listen(configService.getOrThrow('PORT'), () => {
    logger.log(`Listening ot port ${configService.getOrThrow('PORT')}`);
  });
}
bootstrap();
