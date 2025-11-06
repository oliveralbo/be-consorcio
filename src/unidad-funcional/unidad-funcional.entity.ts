import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Persona } from '../persona/persona.entity';

@Entity()
export class UnidadFuncional {
  @PrimaryGeneratedColumn('uuid')
  id_unidad: string;

  @Column()
  numero: string;

  @Column('decimal', { precision: 10, scale: 2 })
  superficie: number;

  @Column()
  ambientes: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'id_propietario' })
  propietario: Persona;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'id_inquilino' })
  inquilino: Persona;

  @Column('decimal', { precision: 5, scale: 4 })
  coeficiente: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
