import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(createUsuarioDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    const nuevoUsuario = this.usuarioRepository.create(createUsuarioDto);
    try {
      return await this.usuarioRepository.save(nuevoUsuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El email ya está en uso.');
      }
      throw error;
    }
  }

  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioRepository.find();
  }

  async findOneByEmail(email: string): Promise<UsuarioApp | null> {
    return this.usuarioRepository.findOne({ where: { email_login: email } });
  }
}
