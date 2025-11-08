import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioAppService } from './usuario.service';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';
import { UsuarioApp } from './usuario.entity';

@Controller('usuariosApp')
export class UsuarioAppController {
  constructor(private readonly usuarioAppService: UsuarioAppService) {}

  @Post()
  create(@Body() createUsuarioAppDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    return this.usuarioAppService.create(createUsuarioAppDto);
  }

  @Get()
  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioAppService.findAll();
  }
}
