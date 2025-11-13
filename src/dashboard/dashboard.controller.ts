import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { RolUsuario } from '../modules/usuario/usuario.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('balance')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  getBalance() {
    return this.dashboardService.getBalance();
  }
}