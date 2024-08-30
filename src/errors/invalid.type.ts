import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTypeException extends HttpException {
  constructor() {
    super('Tipo de medição não permitida', HttpStatus.BAD_REQUEST);
  }
}
