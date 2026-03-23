import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, Between } from 'typeorm';
import { Gasto, TipoGasto } from './gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { UsuarioApp } from '../usuario/usuario.entity';

@Injectable()
export class GastoService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto, userId: string): Promise<Gasto> {
    const newGasto = this.gastoRepository.create({
      ...createGastoDto,
      registrado_por: { id_usuario: userId } as UsuarioApp,
    });

    return this.gastoRepository.save(newGasto);
  }

  async generarMes(mes: number, anio: number, userId: string): Promise<Gasto[]> {
    // 1. Calcular mes y año anterior
    let mesAnterior = mes - 1;
    let anioAnterior = anio;
    if (mesAnterior === 0) {
      mesAnterior = 12;
      anioAnterior = anio - 1;
    }

    // 2. Buscar gastos del mes anterior (tipo mensual)
    const fechaInicioAnterior = new Date(anioAnterior, mesAnterior - 1, 1);
    const fechaFinAnterior = new Date(anioAnterior, mesAnterior, 0);

    const gastosAnteriores = await this.gastoRepository.find({
      where: {
        tipo: TipoGasto.MENSUAL,
        fecha: Between(fechaInicioAnterior, fechaFinAnterior),
      },
    });

    // 3. Si no hay gastos, lanzar excepción
    if (gastosAnteriores.length === 0) {
      throw new NotFoundException(
        'No se encontraron gastos mensuales en el período anterior para copiar',
      );
    }

    // 4 & 5. Clonar y establecer nueva fecha (primer día del mes solicitado)
    const fechaNueva = new Date(anio, mes - 1, 1);
    const nuevosGastos = gastosAnteriores.map((gasto) => {
      return this.gastoRepository.create({
        concepto: gasto.concepto,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        medio: gasto.medio,
        tipo: TipoGasto.MENSUAL,
        fecha: fechaNueva,
        registrado_por: { id_usuario: userId } as UsuarioApp,
      });
    });

    // 6. Guardar y retornar
    return this.gastoRepository.save(nuevosGastos);
  }

  async findAll(options?: FindManyOptions<Gasto>): Promise<Gasto[]> {
    const defaultOptions: FindManyOptions<Gasto> = {
      relations: ['registrado_por', 'registrado_por.persona'],
    };
    return this.gastoRepository.find({ ...defaultOptions, ...options });
  }

  async findOne(id: string): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({
      where: { id_gasto: id },
      relations: ['registrado_por', 'registrado_por.persona'],
    });
    if (!gasto) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    const gasto = await this.gastoRepository.preload({
      id_gasto: id,
      ...updateGastoDto,
    });
    if (!gasto) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
    return this.gastoRepository.save(gasto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.gastoRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gasto con ID "${id}" no encontrado.`);
    }
  }
}
