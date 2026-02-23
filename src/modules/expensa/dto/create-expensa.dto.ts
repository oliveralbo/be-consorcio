import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TipoExpensa } from '../expensa.entity';

export class CreateExpensaDto {
  @IsUUID()
  @IsNotEmpty()
  id_unidad: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  mes: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  anio: number;

  @IsEnum(TipoExpensa)
  @IsOptional()
  tipo?: TipoExpensa;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  monto: number;

  @IsDateString()
  @IsOptional()
  fecha_vencimiento?: Date;
}
