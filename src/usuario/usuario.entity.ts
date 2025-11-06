import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Persona } from '../persona/persona.entity';

export enum RolUsuario {
  TESORERO = 'tesorero',
  VECINO = 'vecino',
}

@Entity()
export class UsuarioApp {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ unique: true })
  email_login: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.VECINO,
  })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @OneToOne(() => Persona)
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
