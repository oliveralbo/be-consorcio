import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioApp } from '../usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findOneByEmail(email);
    if (user && (await user.validatePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<UsuarioApp, 'password'>) {
    const payload = {
      email_login: user.email_login,
      sub: user.id_usuario,
      rol: user.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        nombre: `${user.persona.nombre} ${user.persona.apellido}`,
        email: user.email_login,
        rol: user.rol,
      },
    };
  }
}
