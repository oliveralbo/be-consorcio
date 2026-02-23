import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UnidadFuncional } from '../unidad-funcional/unidad-funcional.entity';

export enum TipoExpensa {
  ORDINARIA = 'ordinaria',
  EXTRAORDINARIA = 'extraordinaria',
}

export enum EstadoExpensa {
  PENDIENTE = 'pendiente',
  PARCIAL = 'parcial',
  PAGADO = 'pagado',
}

@Entity()
export class Expensa {
  @PrimaryGeneratedColumn('uuid')
  id_expensa: string;

  @ManyToOne(() => UnidadFuncional)
  @JoinColumn({ name: 'id_unidad' })
  unidad: UnidadFuncional;

  @Column()
  mes: number;

  @Column()
  anio: number;

  @Column({
    type: 'enum',
    enum: TipoExpensa,
    default: TipoExpensa.ORDINARIA,
  })
  tipo: TipoExpensa;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monto_pagado: number;

  @Column({
    type: 'enum',
    enum: EstadoExpensa,
    default: EstadoExpensa.PENDIENTE,
  })
  estado: EstadoExpensa;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'date', nullable: true })
  fecha_pago: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
