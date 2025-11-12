import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateGastoDto {
  @IsString()
  @IsNotEmpty()
  concepto: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @IsString()
  @IsNotEmpty()
  medio: string;
}
