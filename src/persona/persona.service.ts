import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';

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
}
