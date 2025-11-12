import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadFuncional } from './unidad-funcional.entity';
import { CreateUnidadFuncionalDto } from './dto/create-unidad-funcional.dto';
import { UpdateUnidadFuncionalDto } from './dto/update-unidad-funcional.dto';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class UnidadFuncionalService {
  constructor(
    @InjectRepository(UnidadFuncional)
    private readonly unidadFuncionalRepository: Repository<UnidadFuncional>,
  ) {}

  findAll(): Promise<UnidadFuncional[]> {
    return this.unidadFuncionalRepository.find({ relations: ['propietario', 'inquilino'] });
  }

  async create(createUnidadFuncionalDto: CreateUnidadFuncionalDto): Promise<UnidadFuncional> {
    const { id_propietario, id_inquilino, ...rest } = createUnidadFuncionalDto;

    const nuevaUnidad = this.unidadFuncionalRepository.create({
      ...rest,
      propietario: { id_persona: id_propietario } as Persona,
      ...(id_inquilino && { inquilino: { id_persona: id_inquilino } as Persona }),
    });

    return this.unidadFuncionalRepository.save(nuevaUnidad);
  }

  async findOne(id: string): Promise<UnidadFuncional> {
    const unidad = await this.unidadFuncionalRepository.findOne({
      where: { id_unidad: id },
      relations: ['propietario', 'inquilino'],
    });
    if (!unidad) {
      throw new NotFoundException(`Unidad Funcional con ID "${id}" no encontrada.`);
    }
    return unidad;
  }

  async update(id: string, updateUnidadFuncionalDto: UpdateUnidadFuncionalDto): Promise<UnidadFuncional> {
    const { id_propietario, id_inquilino, ...data } = updateUnidadFuncionalDto;

    const unidad = await this.unidadFuncionalRepository.preload({
      id_unidad: id,
      ...data,
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad Funcional con ID "${id}" no encontrada.`);
    }

    if (id_propietario) {
      unidad.propietario = { id_persona: id_propietario } as Persona;
    }
    if (id_inquilino !== undefined) {
      unidad.inquilino = id_inquilino ? ({ id_persona: id_inquilino } as Persona) : null;
    }

    return this.unidadFuncionalRepository.save(unidad);
  }

  async remove(id: string): Promise<void> {
    const result = await this.unidadFuncionalRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unidad Funcional con ID "${id}" no encontrada.`);
    }
  }
}
