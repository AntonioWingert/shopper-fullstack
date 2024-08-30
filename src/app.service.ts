import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import * as fs from 'fs';
import { join } from 'path';
import { MeasureService } from './measure/measure.service';
import { DoubleReportException } from './errors/double.report.exception';
import { CreateMeasureDto } from './dto/create.measure.dto';
import { MeasureNotFoundException } from './errors/measure.not.found';
import { ConfirmationDuplicateException } from './errors/confirmation.duplicate';

const initialOutputPath = join(__dirname, 'uploads');

if (!fs.existsSync(initialOutputPath)) {
  fs.mkdirSync(initialOutputPath, { recursive: true });
}

@Injectable()
export class AppService {
  constructor(
    private readonly aiService: AiService,
    private readonly measuresService: MeasureService,
  ) {}

  async convertBase64ToImage(base64: string, outputPath: string) {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 string');
    }

    const mimetype = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    fs.writeFileSync(outputPath, buffer);
    return { outputPath, mimetype };
  }

  async upload(body: CreateMeasureDto) {
    const path = join(__dirname, 'uploads', `${Date.now()}.jpg`);
    const { outputPath, mimetype } = await this.convertBase64ToImage(
      body.image,
      path,
    );
    const verifyIfMeasureExists = await this.verifyIfMeasureExists(
      body.measure_type,
      body.measure_datetime,
    );

    if (verifyIfMeasureExists) {
      throw new DoubleReportException();
    }

    const { value, uri } = await this.aiService.readImage(outputPath, mimetype);

    const createdMeasure = await this.measuresService.createMeasure({
      measure_value: +value,
      measure_type: body.measure_type,
      measure_date: body.measure_datetime,
      customer_code: body.customer_code,
    });

    return {
      image_url: uri,
      measure_value: createdMeasure.measure_value,
      measure_uuid: createdMeasure.id,
    };
  }

  async verifyIfMeasureExists(type: 'WATER' | 'GAS', date: Date) {
    const measure = await this.measuresService.getMeasures(date, type);
    return measure;
  }

  async confirm(body: { measure_uuid: string; confirmed_value: number }) {
    const measure = await this.measuresService.getMeasureById(
      body.measure_uuid,
    );

    if (!measure) throw new MeasureNotFoundException();

    if (measure.verified) throw new ConfirmationDuplicateException();

    this.measuresService.updateMeasure(measure.id, body.confirmed_value);

    return {
      success: true,
    };
  }

  async list(customer_code: string, measure_type: string) {
    const measures = await this.measuresService.getMeasuresByCustomerCode(
      customer_code,
      measure_type,
    );

    if (measures.length < 1) throw new MeasureNotFoundException();

    return {
      customer_code: customer_code,
      measures,
    };
  }
}
