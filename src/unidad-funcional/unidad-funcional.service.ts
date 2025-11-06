import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadFuncional } from './unidad-funcional.entity';
import { CreateUnidadFuncionalDto } from './dto/create-unidad-funcional.dto';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class UnidadFuncionalService {
  constructor(
    @InjectRepository(UnidadFuncional)
    private readonly unidadFuncionalRepository: Repository<UnidadFuncional>,
  ) {}

  findAll(): Promise<UnidadFuncional[]> {
    return this.unidadFuncionalRepository.find();
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
}
