import { Controller, Get, Post, Body } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { Persona } from './persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';

@Controller('personas')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto): Promise<Persona> {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  findAll(): Promise<Persona[]> {
    return this.personaService.findAll();
  }
}
