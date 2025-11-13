import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from '../modules/gasto/gasto.entity';
import { Repository } from 'typeorm';
import { Expensa } from '../modules/expensa/expensa.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
    @InjectRepository(Expensa)
    private readonly expensaRepository: Repository<Expensa>,
  ) {}

  async getBalance() {
    const totalIngresosQuery = await this.expensaRepository
      .createQueryBuilder('expensa')
      .select('SUM(expensa.monto)', 'total')
      .where('expensa.pagado = :pagado', { pagado: true })
      .getRawOne();

    const totalEgresosQuery = await this.gastoRepository
      .createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'total')
      .getRawOne();

    const ingresos = parseFloat(totalIngresosQuery?.total) || 0;
    const egresos = parseFloat(totalEgresosQuery?.total) || 0;
    const balance = ingresos - egresos;

    return {
      ingresos,
      egresos,
      balance,
    };
  }
}