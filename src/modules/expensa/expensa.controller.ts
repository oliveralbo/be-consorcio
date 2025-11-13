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
import { ExpensaService } from './expensa.service';
import { CreateExpensaDto } from './dto/create-expensa.dto';
import { UpdateExpensaDto } from './dto/update-expensa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/usuario.entity';

@Controller('expensa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensaController {
  constructor(private readonly expensaService: ExpensaService) {}

  @Post('create')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  create(@Body() createExpensaDto: CreateExpensaDto) {
    return this.expensaService.create(createExpensaDto);
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findAll() {
    return this.expensaService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO, RolUsuario.VECINO)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensaService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpensaDto: UpdateExpensaDto,
  ) {
    return this.expensaService.update(id, updateExpensaDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.expensaService.remove(id);
  }
}
