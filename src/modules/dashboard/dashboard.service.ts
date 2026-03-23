import { Injectable } from '@nestjs/common';
import { GastoService } from '../gasto/gasto.service';
import { ExpensaService } from '../expensa/expensa.service';
import { EstadoExpensa } from '../expensa/expensa.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    private readonly gastoService: GastoService,
    private readonly expensaService: ExpensaService,
  ) {}

  async getBalanceActual(): Promise<{
    ingresos: number;
    egresos: number;
    balance: number;
  }> {
    const hoy = new Date();

    // 1. Calcular todos los egresos (Gastos) hasta hoy
    const todosLosGastos = await this.gastoService.findAll({
      where: {
        fecha: LessThanOrEqual(hoy),
      },
    });
    const totalEgresos = todosLosGastos.reduce(
      (sum, gasto) => sum + parseFloat(gasto.monto.toString()),
      0,
    );

    // 2. Calcular todos los ingresos (Expensas pagadas) hasta hoy
    const todasLasExpensasPagadas = await this.expensaService.findAll({
      where: {
        estado: EstadoExpensa.PAGADO,
        fecha_pago: LessThanOrEqual(hoy),
      },
    });
    const totalIngresos = todasLasExpensasPagadas.reduce(
      (sum, expensa) => sum + parseFloat(expensa.monto.toString()),
      0,
    );

    // 3. El balance (Pozo) es la resta simple
    const balanceActual = totalIngresos - totalEgresos;

    return {
      ingresos: totalIngresos,
      egresos: totalEgresos,
      balance: balanceActual,
    };
  }
}
