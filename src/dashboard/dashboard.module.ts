import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from '../modules/gasto/gasto.entity';
import { Expensa } from '../modules/expensa/expensa.entity';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto, Expensa]), AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
