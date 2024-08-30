import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PatchMeasureDto {
  @IsString()
  @IsNotEmpty()
  measure_uuid: string;

  @IsNumber()
  @IsNotEmpty()
  confirmed_value: number;
}
