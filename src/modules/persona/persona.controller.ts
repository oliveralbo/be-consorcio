import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { PersonaService } from './persona.service';
import { Persona } from './persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('personas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('create')
  @Roles(RolUsuario.ADMIN)
  create(@Body() createPersonaDto: CreatePersonaDto): Promise<Persona> {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findAll(): Promise<Persona[]> {
    return this.personaService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Persona> {
    return this.personaService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonaDto: UpdatePersonaDto,
  ): Promise<Persona> {
    return this.personaService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.personaService.remove(id);
  }
}
