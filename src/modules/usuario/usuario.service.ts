import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioApp } from './usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';
import { UpdateUsuarioAppDto } from './dto/update-usuario.dto';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioApp)
    private readonly usuarioRepository: Repository<UsuarioApp>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    const { id_persona, ...rest } = createUsuarioDto;
    const nuevoUsuario = this.usuarioRepository.create({
      ...rest,
      persona: { id_persona: id_persona } as Persona,
    });
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
    return this.usuarioRepository.find({ relations: ['persona'] });
  }

  async findOneByEmail(email: string): Promise<UsuarioApp | null> {
    return this.usuarioRepository.findOne({ where: { email_login: email }, relations: ['persona'] });
  }

  async findOne(id: string): Promise<UsuarioApp> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['persona'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioAppDto): Promise<UsuarioApp> {
    const { id_persona, password, ...data } = updateUsuarioDto;

    const usuario = await this.usuarioRepository.preload({
      id_usuario: id,
      ...data,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (id_persona) {
      usuario.persona = { id_persona: id_persona } as Persona;
    }

    if (password) {
      usuario.password = password;
      await usuario.hashPassword();
    }

    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El email ya está en uso.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuarioRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
  }
}
