import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateUnidadFuncionalDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsNumber()
  @IsOptional()
  superficie?: number;

  @IsNumber()
  ambientes: number;

  @IsString()
  @IsOptional()
  piso?: string;

  @IsNumber()
  @IsOptional()
  monto_base?: number;

  @IsUUID()
  id_propietario: string;

  @IsUUID()
  @IsOptional()
  id_inquilino?: string;
}
