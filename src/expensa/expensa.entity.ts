import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UnidadFuncional } from '../unidad-funcional/unidad-funcional.entity';

export enum TipoExpensa {
  ORDINARIA = 'ordinaria',
  EXTRAORDINARIA = 'extraordinaria',
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

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ default: false })
  pagado: boolean;

  @Column({ type: 'date', nullable: true })
  fecha_pago: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
