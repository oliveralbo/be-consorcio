import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaModule } from './persona/persona.module';
import { UsuarioAppModule } from './usuario/usuario.module';
import { UnidadFuncionalModule } from './unidad-funcional/unidad-funcional.module';
import { ExpensaModule } from './expensa/expensa.module';
import { GastoModule } from './gasto/gasto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'consorcio_user',
      password: '1234',
      database: 'consorcio_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Nota: synchronize:true es útil para desarrollo, pero se recomienda desactivarlo en producción.
    }),
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
