import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UnidadFuncionalService } from './unidad-funcional.service';
import { UnidadFuncional } from './unidad-funcional.entity';
import { CreateUnidadFuncionalDto } from './dto/create-unidad-funcional.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('unidades-funcionales')
export class UnidadFuncionalController {
  constructor(private readonly unidadFuncionalService: UnidadFuncionalService) {}

  @Get()
  findAll(): Promise<UnidadFuncional[]> {
    return this.unidadFuncionalService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  create(@Body() createUnidadFuncionalDto: CreateUnidadFuncionalDto): Promise<UnidadFuncional> {
    return this.unidadFuncionalService.create(createUnidadFuncionalDto);
  }
}
