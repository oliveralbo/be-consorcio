import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expensa } from './expensa.entity';
import { ExpensaService } from './expensa.service';
import { ExpensaController } from './expensa.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expensa]), AuthModule],
  providers: [ExpensaService],
  controllers: [ExpensaController],
})
export class ExpensaModule {}
