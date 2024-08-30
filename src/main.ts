import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const generativeAiService = app.get(AiService);

  await generativeAiService.onModuleInit();

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json());

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
