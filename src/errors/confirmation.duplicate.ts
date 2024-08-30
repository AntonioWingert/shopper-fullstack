import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfirmationDuplicateException extends HttpException {
  constructor() {
    super('Leitura do mês já confirmada', HttpStatus.CONFLICT);
  }
}
