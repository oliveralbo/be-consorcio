import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['mes', 'anio']) // Uniqueness constraint to ensure only one entry per month/year
export class CierreMensual {
  @PrimaryGeneratedColumn('uuid')
  id_cierre_mensual: string;

  @Column()
  mes: number; // 1-12

  @Column()
  anio: number; // e.g., 2025

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balanceInicial: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalIngresos: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalEgresos: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balanceFinal: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
