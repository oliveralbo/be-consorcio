import { Injectable } from '@nestjs/common';
import { GastoService } from '../gasto/gasto.service';
import { ExpensaService } from '../expensa/expensa.service';

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
    // 1. Calcular todos los egresos (Gastos) históricos
    const todosLosGastos = await this.gastoService.findAll();
    const totalEgresos = todosLosGastos.reduce(
      (sum, gasto) => sum + parseFloat(gasto.monto.toString()),
      0,
    );

    // 2. Calcular todos los ingresos (Expensas pagadas) históricos
    const todasLasExpensasPagadas = await this.expensaService.findAll({
      where: {
        pagado: true,
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
