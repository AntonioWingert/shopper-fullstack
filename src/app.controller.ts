import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMeasureDto } from './dto/create.measure.dto';
import { PatchMeasureDto } from './dto/patch.measure.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  upload(
    @UploadedFile()
    @Body()
    body: CreateMeasureDto,
  ) {
    return this.appService.upload(body);
  }

  @HttpCode(200)
  @Patch('confirm')
  confirm(@Body() body: PatchMeasureDto) {
    return this.appService.confirm(body);
  }

  @HttpCode(200)
  @Get(':customer_code/list')
  list(
    @Param('customer_code') customer_code: string,
    @Query('measure_type') measure_type: string,
  ) {
    return this.appService.list(customer_code, measure_type);
  }
}
