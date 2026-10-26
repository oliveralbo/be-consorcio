import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RolUsuario } from '../usuario/usuario.entity';

interface JwtPayload {
  sub: string;
  email_login: string;
  rol: RolUsuario;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    // El payload del token ya fue validado por passport-jwt en este punto
    // Aquí podemos enriquecer el objeto `request.user` si es necesario
    return {
      id_usuario: payload.sub,
      email_login: payload.email_login,
      rol: payload.rol,
    };
  }
}
