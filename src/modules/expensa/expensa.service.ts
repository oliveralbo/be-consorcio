import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Expensa, TipoExpensa, EstadoExpensa } from './expensa.entity';
import { CreateExpensaDto } from './dto/create-expensa.dto';
import { UpdateExpensaDto } from './dto/update-expensa.dto';
import { UnidadFuncional } from '../unidad-funcional/unidad-funcional.entity';
import { UnidadFuncionalService } from '../unidad-funcional/unidad-funcional.service';

@Injectable()
export class ExpensaService {
  constructor(
    @InjectRepository(Expensa)
    private readonly expensaRepository: Repository<Expensa>,
    private readonly unidadFuncionalService: UnidadFuncionalService,
  ) {}

  async create(createExpensaDto: CreateExpensaDto): Promise<Expensa> {
    const { id_unidad, ...rest } = createExpensaDto;
    const newExpensa = this.expensaRepository.create({
      ...rest,
      unidad: { id_unidad: id_unidad } as UnidadFuncional,
    });

    return this.expensaRepository.save(newExpensa);
  }

  /**
   * Genera las expensas ordinarias del mes para todas las unidades funcionales
   * basándose en su monto_base.
   */
  async generarExpensasMes(mes: number, anio: number): Promise<Expensa[]> {
    // 1. Obtener todas las unidades funcionales
    const unidades = await this.unidadFuncionalService.findAll();

    const nuevasExpensas: Expensa[] = [];

    for (const unidad of unidades) {
      // 2. Verificar si ya existe una expensa ORDINARIA para esta unidad en este mes/año
      const existe = await this.expensaRepository.findOne({
        where: {
          unidad: { id_unidad: unidad.id_unidad },
          mes,
          anio,
          tipo: TipoExpensa.ORDINARIA,
        },
      });

      if (!existe) {
        // 3. Crear la expensa ordinaria con el monto_base de la unidad
        const fechaVencimiento = new Date(anio, mes - 1, 10); // Vencimiento por defecto el día 10 del mes

        const nuevaExpensa = this.expensaRepository.create({
          unidad,
          mes,
          anio,
          tipo: TipoExpensa.ORDINARIA,
          monto: unidad.monto_base,
          fecha_vencimiento: fechaVencimiento,
          descripcion: `Expensa ordinaria correspondiente a ${mes}/${anio}`,
        });

        nuevasExpensas.push(nuevaExpensa);
      }
    }

    if (nuevasExpensas.length === 0) {
      throw new ConflictException(
        `Las expensas para el período ${mes}/${anio} ya fueron generadas o no hay unidades configuradas.`,
      );
    }

    return this.expensaRepository.save(nuevasExpensas);
  }

  async findAll(options?: FindManyOptions<Expensa>): Promise<Expensa[]> {
    const defaultOptions: FindManyOptions<Expensa> = {
      relations: ['unidad'],
    };
    return this.expensaRepository.find({ ...defaultOptions, ...options });
  }

  async findOne(id: string): Promise<Expensa> {
    const expensa = await this.expensaRepository.findOne({
      where: { id_expensa: id },
      relations: ['unidad'],
    });
    if (!expensa) {
      throw new NotFoundException(`Expensa con ID "${id}" no encontrada.`);
    }
    return expensa;
  }

  async update(
    id: string,
    updateExpensaDto: UpdateExpensaDto,
  ): Promise<Expensa> {
    const { id_unidad, ...data } = updateExpensaDto;
    const expensa = await this.expensaRepository.preload({
      id_expensa: id,
      ...data,
    });

    if (!expensa) {
      throw new NotFoundException(`Expensa con ID "${id}" no encontrada.`);
    }

    if (id_unidad) {
      expensa.unidad = { id_unidad } as UnidadFuncional;
    }

    // Actualizar estado automáticamente según el monto pagado
    if (expensa.monto_pagado >= expensa.monto) {
      expensa.estado = EstadoExpensa.PAGADO;
      if (!expensa.fecha_pago) expensa.fecha_pago = new Date();
    } else if (expensa.monto_pagado > 0) {
      expensa.estado = EstadoExpensa.PARCIAL;
    } else {
      expensa.estado = EstadoExpensa.PENDIENTE;
    }

    return this.expensaRepository.save(expensa);
  }

  async remove(id: string): Promise<void> {
    const result = await this.expensaRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expensa con ID "${id}" no encontrado.`);
    }
  }
}
