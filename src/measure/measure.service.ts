import { Injectable } from '@nestjs/common';
import { InvalidTypeException } from '../errors/invalid.type';
import { NotFoundException } from '../errors/not.found';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeasureService {
  constructor(private prisma: PrismaService) {}

  async createMeasure({
    measure_value,
    measure_type,
    measure_date,
    customer_code,
  }: {
    measure_value: number;
    measure_type: string;
    measure_date: Date;
    customer_code: string;
  }) {
    return await this.prisma.measures.create({
      data: {
        measure_value,
        measure_type,
        measure_date: new Date(measure_date),
        customer_code,
      },
    });
  }

  async getMeasures(measure_datetime: Date, measure_type: string) {
    const dateObj =
      typeof measure_datetime === 'string'
        ? new Date(measure_datetime)
        : measure_datetime;

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const measures = await this.prisma.measures.findFirst({
      where: {
        measure_type,
        measure_date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    return measures;
  }

  async getMeasureById(measure_uuid: string) {
    return await this.prisma.measures.findUnique({
      where: {
        id: measure_uuid,
      },
    });
  }

  async updateMeasure(measure_uuid: string, measure_value: number) {
    return await this.prisma.measures.update({
      where: { id: measure_uuid },
      data: { measure_value, verified: true },
    });
  }

  async getMeasuresByCustomerCode(
    customer_code: string,
    measure_type?: string,
  ) {
    if (
      measure_type &&
      measure_type.toLocaleLowerCase() !== 'gas' &&
      measure_type.toLocaleLowerCase() !== 'water'
    ) {
      throw new InvalidTypeException();
    }

    const measures = await this.prisma.measures.findMany({
      where: {
        customer_code,
        measure_type: measure_type || undefined,
      },
    });

    if (measures.length < 1) {
      throw new NotFoundException();
    }

    return measures;
  }
}
