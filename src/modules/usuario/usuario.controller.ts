import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioAppDto } from './dto/create-usuario.dto';
import { UpdateUsuarioAppDto } from './dto/update-usuario.dto';
import { UsuarioApp, RolUsuario } from './usuario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Roles(RolUsuario.ADMIN)
  create(@Body() createUsuarioDto: CreateUsuarioAppDto): Promise<UsuarioApp> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @Roles(RolUsuario.ADMIN)
  findAll(): Promise<UsuarioApp[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioApp> {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioAppDto,
  ): Promise<UsuarioApp> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usuarioService.remove(id);
  }
}
