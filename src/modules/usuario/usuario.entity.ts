import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Persona } from '../persona/persona.entity';
import * as bcrypt from 'bcrypt';

export enum RolUsuario {
  TESORERO = 'tesorero',
  VECINO = 'vecino',
  ADMIN = 'administrador',
}

@Entity()
export class UsuarioApp {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ unique: true })
  email_login: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.VECINO,
  })
  rol: RolUsuario;

  @OneToOne(() => Persona, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
