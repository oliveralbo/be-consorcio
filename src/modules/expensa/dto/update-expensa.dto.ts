import { PartialType } from '@nestjs/mapped-types';
import { CreateExpensaDto } from './create-expensa.dto';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateExpensaDto extends PartialType(CreateExpensaDto) {
  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsDateString()
  @IsOptional()
  fecha_pago?: Date;
}
