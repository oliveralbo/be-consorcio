import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Expensa } from './expensa.entity';
import { CreateExpensaDto } from './dto/create-expensa.dto';
import { UpdateExpensaDto } from './dto/update-expensa.dto';
import { UnidadFuncional } from '../unidad-funcional/unidad-funcional.entity';

@Injectable()
export class ExpensaService {
  constructor(
    @InjectRepository(Expensa)
    private readonly expensaRepository: Repository<Expensa>,
  ) {}

  async create(createExpensaDto: CreateExpensaDto): Promise<Expensa> {
    const { id_unidad, ...rest } = createExpensaDto;
    const newExpensa = this.expensaRepository.create({
      ...rest,
      unidad: { id_unidad: id_unidad } as UnidadFuncional,
    });

    return this.expensaRepository.save(newExpensa);
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

  async update(id: string, updateExpensaDto: UpdateExpensaDto): Promise<Expensa> {
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
    return this.expensaRepository.save(expensa);
  }

  async remove(id: string): Promise<void> {
    const result = await this.expensaRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expensa con ID "${id}" no encontrado.`);
    }
  }
}
