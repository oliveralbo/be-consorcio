import { Controller, Get, Post, Body } from '@nestjs/common';
import { UnidadFuncionalService } from './unidad-funcional.service';
import { UnidadFuncional } from './unidad-funcional.entity';
import { CreateUnidadFuncionalDto } from './dto/create-unidad-funcional.dto';

@Controller('unidades-funcionales')
export class UnidadFuncionalController {
  constructor(private readonly unidadFuncionalService: UnidadFuncionalService) {}

  @Get()
  findAll(): Promise<UnidadFuncional[]> {
    return this.unidadFuncionalService.findAll();
  }

  @Post()
  create(@Body() createUnidadFuncionalDto: CreateUnidadFuncionalDto): Promise<UnidadFuncional> {
    return this.unidadFuncionalService.create(createUnidadFuncionalDto);
  }
}
