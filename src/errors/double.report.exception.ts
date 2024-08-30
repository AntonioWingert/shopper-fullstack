import { HttpException, HttpStatus } from '@nestjs/common';

export class DoubleReportException extends HttpException {
  constructor() {
    super('Leitura do mês já realizada', HttpStatus.CONFLICT);
  }
}
