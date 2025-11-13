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
} from '@nestjs/common';
import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('gasto')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post('create')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  create(@Body() createGastoDto: CreateGastoDto, @Request() req) {
    return this.gastoService.create(createGastoDto, req.user.id_usuario);
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findAll() {
    return this.gastoService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastoService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return this.gastoService.update(id, updateGastoDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gastoService.remove(id);
  }
}
