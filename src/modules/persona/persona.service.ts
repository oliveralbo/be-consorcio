import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const nuevaPersona = this.personaRepository.create(createPersonaDto);
    return this.personaRepository.save(nuevaPersona);
  }

  findAll(): Promise<Persona[]> {
    return this.personaRepository.find();
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personaRepository.findOneBy({ id_persona: id });
    if (!persona) {
      throw new NotFoundException(`Persona con ID "${id}" no encontrada.`);
    }
    return persona;
  }

  async update(
    id: string,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<Persona> {
    const persona = await this.personaRepository.preload({
      id_persona: id,
      ...updatePersonaDto,
    });
    if (!persona) {
      throw new NotFoundException(`Persona con ID "${id}" no encontrada.`);
    }
    return this.personaRepository.save(persona);
  }

  async remove(id: string): Promise<void> {
    const result = await this.personaRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Persona con ID "${id}" no encontrada.`);
    }
  }
}
