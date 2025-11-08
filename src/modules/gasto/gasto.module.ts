import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './gasto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto])],
  providers: [],
  controllers: [],
})
export class GastoModule {}
