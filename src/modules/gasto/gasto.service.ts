import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from './gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { UsuarioApp } from '../usuario/usuario.entity';

@Injectable()
export class GastoService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto, userId: string): Promise<Gasto> {
    const newGasto = this.gastoRepository.create({
      ...createGastoDto,
      registrado_por: { id_usuario: userId } as UsuarioApp,
    });

    return this.gastoRepository.save(newGasto);
  }

  async findAll(): Promise<Gasto[]> {
    return this.gastoRepository.find({
      relations: ['registrado_por', 'registrado_por.persona'],
    });
  }

  async findOne(id: string): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({
      where: { id_gasto: id },
      relations: ['registrado_por', 'registrado_por.persona'],
    });
    if (!gasto) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    const gasto = await this.gastoRepository.preload({
      id_gasto: id,
      ...updateGastoDto,
    });
    if (!gasto) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
    return this.gastoRepository.save(gasto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.gastoRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
  }
}
