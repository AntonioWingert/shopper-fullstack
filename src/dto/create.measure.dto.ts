import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateMeasureDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpg|jpeg);base64,/)
  image: string;

  @IsString()
  @IsNotEmpty()
  customer_code: string;

  @IsDateString()
  @IsNotEmpty()
  measure_datetime: Date;

  @IsString()
  @IsNotEmpty()
  @IsIn(['WATER', 'GAS'])
  measure_type: 'WATER' | 'GAS';
}
