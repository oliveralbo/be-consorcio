import { Controller, Post, Param, ParseIntPipe, Get, UseGuards } from '@nestjs/common';
import { CierreMensualService } from './cierre-mensual.service';
import { CierreMensual } from './cierre-mensual.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cierre-mensual')
export class CierreMensualController {
  constructor(private readonly cierreMensualService: CierreMensualService) {}

  @Roles(RolUsuario.ADMIN) // Only admin can trigger month closing
  @Post(':anio/:mes/cerrar')
  async cerrarMes(
    @Param('mes', ParseIntPipe) mes: number,
    @Param('anio', ParseIntPipe) anio: number,
  ): Promise<CierreMensual> {
    return this.cierreMensualService.calculateAndCloseMonth(mes, anio);
  }

  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO) // Both admin and treasurer can view
  @Get(':anio/:mes')
  async getCierreMensual(
    @Param('mes', ParseIntPipe) mes: number,
    @Param('anio', ParseIntPipe) anio: number,
  ): Promise<CierreMensual> {
    return this.cierreMensualService.findByMonthAndYear(mes, anio);
  }

  // Potentially add other endpoints for listing or summarizing cierres
}
