import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioApp)
    private readonly usuarioRepository: Repository<UsuarioApp>,
  ) {}

  create(createUsuarioDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    const nuevoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(nuevoUsuario);
  }

  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioRepository.find();
  }

  async findOneByEmail(email: string): Promise<UsuarioApp | null> {
    return this.usuarioRepository.findOne({ where: { email_login: email } });
  }
}
