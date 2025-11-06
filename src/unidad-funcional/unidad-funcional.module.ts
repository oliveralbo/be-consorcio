import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadFuncional } from './unidad-funcional.entity';
import { UnidadFuncionalController } from './unidad-funcional.controller';
import { UnidadFuncionalService } from './unidad-funcional.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadFuncional])],
  providers: [UnidadFuncionalService],
  controllers: [UnidadFuncionalController],
})
export class UnidadFuncionalModule {}
