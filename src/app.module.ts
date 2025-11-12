import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaModule } from './modules/persona/persona.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { UnidadFuncionalModule } from './modules/unidad-funcional/unidad-funcional.module';
import { ExpensaModule } from './modules/expensa/expensa.module';
import { GastoModule } from './modules/gasto/gasto.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './config/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PersonaModule,
    UsuarioModule,
    UnidadFuncionalModule,
    ExpensaModule,
    GastoModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
