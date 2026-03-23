import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class GenerarMesGastoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  mes: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  anio: number;
}
