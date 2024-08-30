import { Module } from '@nestjs/common';
import { MeasureService } from './measure.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  exports: [MeasureService],
  providers: [MeasureService, PrismaService],
})
export class MeasureModule {}
