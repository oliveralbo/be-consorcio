import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UsuarioApp } from '../usuario/usuario.entity';

@Entity()
export class Gasto {
  @PrimaryGeneratedColumn('uuid')
  id_gasto: string;

  @Column()
  concepto: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  medio: string;

  @ManyToOne(() => UsuarioApp)
  @JoinColumn({ name: 'registrado_por' })
  registrado_por: UsuarioApp;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
