import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioApp])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
