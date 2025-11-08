import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaModule } from './modules/persona/persona.module';
import { UsuarioAppModule } from './modules/usuario/usuario.module';
import { UnidadFuncionalModule } from './modules/unidad-funcional/unidad-funcional.module';
import { ExpensaModule } from './modules/expensa/expensa.module';
import { GastoModule } from './modules/gasto/gasto.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PersonaModule,
    UsuarioAppModule,
    UnidadFuncionalModule,
    ExpensaModule,
    GastoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
