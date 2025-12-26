import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CierreMensual } from './cierre-mensual.entity';
import { CierreMensualService } from './cierre-mensual.service';
import { CierreMensualController } from './cierre-mensual.controller';
import { GastoModule } from '../gasto/gasto.module'; // To get GastoService
import { ExpensaModule } from '../expensa/expensa.module'; // To get ExpensaService

@Module({
  imports: [TypeOrmModule.forFeature([CierreMensual]), GastoModule, ExpensaModule],
  providers: [CierreMensualService],
  controllers: [CierreMensualController],
  exports: [CierreMensualService], // Export the service if other modules need to use it
})
export class CierreMensualModule {}
