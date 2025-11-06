import { IsString, IsNotEmpty, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateUnidadFuncionalDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsNumber()
  superficie: number;

  @IsNumber()
  ambientes: number;

  @IsNumber()
  coeficiente: number;

  @IsUUID()
  id_propietario: string;

  @IsUUID()
  @IsOptional()
  id_inquilino?: string;
}
