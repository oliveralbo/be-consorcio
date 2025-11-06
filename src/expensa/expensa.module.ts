import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expensa } from './expensa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expensa])],
  providers: [],
  controllers: [],
})
export class ExpensaModule {}
