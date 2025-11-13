import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadFuncionalDto } from './create-unidad-funcional.dto';

export class UpdateUnidadFuncionalDto extends PartialType(CreateUnidadFuncionalDto) {}
