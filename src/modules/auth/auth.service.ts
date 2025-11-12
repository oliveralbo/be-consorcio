import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

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

  async login(user: any) {
    const payload = {
      email_login: user.email_login,
      sub: user.id_usuario,
      rol: user.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
