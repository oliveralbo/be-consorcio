import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { Persona } from './persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('personas')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  create(@Body() createPersonaDto: CreatePersonaDto): Promise<Persona> {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  findAll(): Promise<Persona[]> {
    return this.personaService.findAll();
  }
}
