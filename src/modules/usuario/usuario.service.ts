import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioAppService {
  constructor(
    @InjectRepository(UsuarioApp)
    private readonly usuarioAppRepository: Repository<UsuarioApp>,
  ) {}

  create(createUsuarioApp: CreateUsuarioAppDto): Promise<UsuarioApp> {
    const nuevoUsuario = this.usuarioAppRepository.create(createUsuarioApp);
    return this.usuarioAppRepository.save(nuevoUsuario);
  }

  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioAppRepository.find();
  }
}
