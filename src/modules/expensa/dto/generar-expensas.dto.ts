import { IsInt, Min, Max } from 'class-validator';

export class GenerarExpensasDto {
  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;

  @IsInt()
  @Min(2020)
  anio: number;
}
