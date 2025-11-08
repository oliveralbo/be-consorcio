import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioApp])],
  providers: [],
  controllers: [],
})
export class UsuarioAppModule {}
