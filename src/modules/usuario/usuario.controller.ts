import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';
import { UsuarioApp } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioService.findAll();
  }
}
