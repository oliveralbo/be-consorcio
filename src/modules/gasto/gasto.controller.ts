import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  Req,
} from '@nestjs/common';
import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { GenerarMesGastoDto } from './dto/generar-mes-gasto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';
import { Gasto } from './gasto.entity';

@Controller('gasto')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post('create')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  create(
    @Body() createGastoDto: CreateGastoDto,
    @Req() req: Request & { user: { id_usuario: string } },
  ): Promise<Gasto> {
    return this.gastoService.create(createGastoDto, req.user.id_usuario);
  }

  @Post('generar-mes')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  generarMes(
    @Body() data: GenerarMesGastoDto,
    @Req() req: { user: { id_usuario: string } },
  ): Promise<Gasto[]> {
    return this.gastoService.generarMes(
      data.mes,
      data.anio,
      req.user.id_usuario,
    );
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findAll(): Promise<Gasto[]> {
    return this.gastoService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Gasto> {
    return this.gastoService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGastoDto: UpdateGastoDto,
  ): Promise<Gasto> {
    return this.gastoService.update(id, updateGastoDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gastoService.remove(id);
  }
}
