import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai/ai.service';
import { MeasureService } from './measure/measure.service';
import { MeasureModule } from './measure/measure.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiModule,
    MeasureModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiService, MeasureService, PrismaService],
})
export class AppModule {}
