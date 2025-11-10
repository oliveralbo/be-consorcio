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

  @IsUUID()
  id_propietario: string;

  @IsUUID()
  @IsOptional()
  id_inquilino?: string;
}
