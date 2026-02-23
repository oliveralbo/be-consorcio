import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expensa } from './expensa.entity';
import { ExpensaService } from './expensa.service';
import { ExpensaController } from './expensa.controller';
import { AuthModule } from '../auth/auth.module';
import { UnidadFuncionalModule } from '../unidad-funcional/unidad-funcional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expensa]),
    AuthModule,
    UnidadFuncionalModule,
  ],
  providers: [ExpensaService],
  controllers: [ExpensaController],
  exports: [ExpensaService],
})
export class ExpensaModule {}
