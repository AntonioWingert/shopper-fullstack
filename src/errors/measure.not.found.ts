import { HttpException, HttpStatus } from '@nestjs/common';

export class MeasureNotFoundException extends HttpException {
  constructor() {
    super('Leitura do mês não encontrada', HttpStatus.NOT_FOUND);
  }
}
