import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsuarioApp } from '../usuario/usuario.entity';
import { Request as ExpressRequest } from 'express';

// Creamos una interfaz que extiende la Request de Express y le tipamos el user
interface RequestWithUser extends ExpressRequest {
  user: Omit<UsuarioApp, 'password'>;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}
