import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { TipoExpensa } from '../expensa.entity';

export class CreateExpensaDto {
  @IsUUID()
  @IsNotEmpty()
  id_unidad: string;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  mes: number;

  @IsInt()
  @Min(2020)
  @IsNotEmpty()
  anio: number;

  @IsEnum(TipoExpensa)
  @IsNotEmpty()
  tipo: TipoExpensa;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;
}
