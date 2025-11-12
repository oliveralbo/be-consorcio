import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UnidadFuncionalService } from './unidad-funcional.service';
import { UnidadFuncional } from './unidad-funcional.entity';
import { CreateUnidadFuncionalDto } from './dto/create-unidad-funcional.dto';
import { UpdateUnidadFuncionalDto } from './dto/update-unidad-funcional.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('unidades-funcionales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnidadFuncionalController {
  constructor(private readonly unidadFuncionalService: UnidadFuncionalService) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findAll(): Promise<UnidadFuncional[]> {
    return this.unidadFuncionalService.findAll();
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  create(@Body() createUnidadFuncionalDto: CreateUnidadFuncionalDto): Promise<UnidadFuncional> {
    return this.unidadFuncionalService.create(createUnidadFuncionalDto);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UnidadFuncional> {
    return this.unidadFuncionalService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnidadFuncionalDto: UpdateUnidadFuncionalDto,
  ): Promise<UnidadFuncional> {
    return this.unidadFuncionalService.update(id, updateUnidadFuncionalDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.unidadFuncionalService.remove(id);
  }
}
