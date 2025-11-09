import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';
import { UsuarioAppController } from './usuario.controller';
import { UsuarioAppService } from './usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioApp])],
  providers: [UsuarioAppService],
  controllers: [UsuarioAppController],
})
export class UsuarioAppModule {}
