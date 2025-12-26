import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './gasto.entity';
import { GastoService } from './gasto.service';
import { GastoController } from './gasto.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto]), AuthModule],
  providers: [GastoService],
  controllers: [GastoController],
  exports: [GastoService],
})
export class GastoModule {}
