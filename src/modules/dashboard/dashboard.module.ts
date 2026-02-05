import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { GastoModule } from '../gasto/gasto.module';
import { ExpensaModule } from '../expensa/expensa.module';
@Module({
  imports: [AuthModule, GastoModule, ExpensaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
