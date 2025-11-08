import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID } from "class-validator";
import { RolUsuario } from "../usuario.entity";

export class CreateUsuarioAppDto {
  @IsString()
  @IsNotEmpty()
  email_login: string;

  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsEnum(RolUsuario)
  @IsNotEmpty()
  rol: RolUsuario;

  @IsUUID()
  @IsNotEmpty()
  id_persona: string;
}