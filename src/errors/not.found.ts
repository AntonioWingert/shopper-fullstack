import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super('Nenhuma leitura encontrada', HttpStatus.NOT_FOUND);
  }
}
