import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CierreMensual } from './cierre-mensual.entity';
import { GastoService } from '../gasto/gasto.service';
import { ExpensaService } from '../expensa/expensa.service';
import { Gasto } from '../gasto/gasto.entity';
import { Expensa } from '../expensa/expensa.entity';

@Injectable()
export class CierreMensualService {
  constructor(
    @InjectRepository(CierreMensual)
    private cierreMensualRepository: Repository<CierreMensual>,
    private gastoService: GastoService,
    private expensaService: ExpensaService,
  ) {}

  async findLastCierreMensual(): Promise<CierreMensual | null> {
    return this.cierreMensualRepository.findOne({
      order: {
        anio: 'DESC',
        mes: 'DESC',
      },
    });
  }

  async calculateAndCloseMonth(mes: number, anio: number): Promise<CierreMensual> {
    // 1. Check if this month has already been closed
    const existingCierre = await this.cierreMensualRepository.findOne({ where: { mes, anio } });
    if (existingCierre) {
      throw new ConflictException(`El cierre para el mes ${mes}/${anio} ya existe.`);
    }

    // 2. Get the balance from the last closed month
    let balanceInicial = 0;
    const lastCierre = await this.findLastCierreMensual();
    if (lastCierre) {
      // Ensure the 'lastCierre' is for a month *before* the current closing month
      if (lastCierre.anio < anio || (lastCierre.anio === anio && lastCierre.mes < mes)) {
         balanceInicial = lastCierre.balanceFinal;
      } else {
         // This case should ideally not happen if closing is done chronologically
         // But it's a safeguard to prevent using a future/same month's balance
         balanceInicial = 0; // Or throw an error if strict chronological order is enforced
      }
    }

    // 3. Define the date range for the current month's transactions
    const startDate = new Date(anio, mes - 1, 1); // Month is 0-indexed in JS Date
    const endDate = new Date(anio, mes, 0); // Last day of the month

    // 4. Calculate total expenses (egresos) for the month
    const gastos: Gasto[] = await this.gastoService.findAll({
        where: {
            fecha: Between(startDate, endDate)
        }
    });
    const totalEgresos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto.toString()), 0);


    // 5. Calculate total income (ingresos) for the month (only paid expensas)
    const expensasPagadas: Expensa[] = await this.expensaService.findAll({
        where: {
            fecha_pago: Between(startDate, endDate),
            pagado: true
        }
    });
    const totalIngresos = expensasPagadas.reduce((sum, expensa) => sum + parseFloat(expensa.monto.toString()), 0);

    // 6. Calculate final balance
    const balanceFinal = balanceInicial + totalIngresos - totalEgresos;

    // 7. Create and save the new CierreMensual record
    const nuevoCierre = this.cierreMensualRepository.create({
      mes,
      anio,
      balanceInicial,
      totalIngresos,
      totalEgresos,
      balanceFinal,
    });

    return this.cierreMensualRepository.save(nuevoCierre);
  }

  async findByMonthAndYear(mes: number, anio: number): Promise<CierreMensual> {
    const cierre = await this.cierreMensualRepository.findOne({ where: { mes, anio } });
    if (!cierre) {
      throw new NotFoundException(`Cierre mensual para ${mes}/${anio} no encontrado.`);
    }
    return cierre;
  }

  // Potentially add methods for listing all cierres, etc.
}
