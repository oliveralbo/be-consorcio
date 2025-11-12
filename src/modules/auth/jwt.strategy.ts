import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // El payload del token ya fue validado por passport-jwt en este punto
    // Aquí podemos enriquecer el objeto `request.user` si es necesario
    return { id_usuario: payload.sub, email_login: payload.email_login, rol: payload.rol };
  }
}
