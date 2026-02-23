import { PartialType } from '@nestjs/mapped-types';
import { CreateExpensaDto } from './create-expensa.dto';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateExpensaDto extends PartialType(CreateExpensaDto) {
  @IsNumber()
  @IsOptional()
  @Min(0)
  monto_pagado?: number;

  @IsDateString()
  @IsOptional()
  fecha_pago?: Date;
}
