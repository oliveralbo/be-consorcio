import { Injectable } from '@nestjs/common';
import { GastoService } from '../gasto/gasto.service';
import { ExpensaService } from '../expensa/expensa.service';
import { CierreMensualService } from '../cierre-mensual/cierre-mensual.service';
import { Between } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    private readonly gastoService: GastoService,
    private readonly expensaService: ExpensaService,
    private readonly cierreMensualService: CierreMensualService,
  ) {}

  async getBalanceActual(): Promise<{ ingresos: number; egresos: number; balance: number }> {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentYear = today.getFullYear();

    let balanceInicialMesActual = 0;

    // 1. Get the last closed balance
    const lastCierre = await this.cierreMensualService.findLastCierreMensual();
    if (lastCierre) {
      // If the last closure is for a month before the current month/year
      if (lastCierre.anio < currentYear || (lastCierre.anio === currentYear && lastCierre.mes < currentMonth)) {
        balanceInicialMesActual = lastCierre.balanceFinal;
      }
    }

    // 2. Calculate current month's transactions
    const startDate = new Date(currentYear, currentMonth - 1, 1); // First day of current month
    const endDate = new Date(currentYear, currentMonth, 0); // Last day of current month

    // Current month's expenses
    const gastosMesActual = await this.gastoService.findAll({
      where: {
        fecha: Between(startDate, endDate),
      },
    });
    const egresosMesActual = gastosMesActual.reduce((sum, gasto) => sum + parseFloat(gasto.monto.toString()), 0);

    // Current month's paid expensas (incomes)
    const expensasPagadasMesActual = await this.expensaService.findAll({
      where: {
        fecha_pago: Between(startDate, endDate),
        pagado: true,
      },
    });
    const ingresosMesActual = expensasPagadasMesActual.reduce((sum, expensa) => sum + parseFloat(expensa.monto.toString()), 0);

    const balanceActual = balanceInicialMesActual + ingresosMesActual - egresosMesActual;

    return {
      ingresos: ingresosMesActual,
      egresos: egresosMesActual,
      balance: balanceActual,
    };
  }
}