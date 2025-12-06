import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { CreateUsuarioAppDto } from '../modules/usuario/dto/create-usuario.dto';
import { RolUsuario } from '../modules/usuario/usuario.entity';
import { PersonaService } from '../modules/persona/persona.service'; // Changed from persona.service to persona.entity here? Let's check the context for this path
import * as readline from 'readline';

// Helper para usar readline con async/await
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function runSeed() {
  console.log('--- Creación del Usuario Administrador Interactivo ---');

  const nombre = await askQuestion('Nombre de la persona: ');
  const apellido = await askQuestion('Apellido de la persona: ');
  const dni = await askQuestion('DNI: ');
  const telefono = await askQuestion('Teléfono: ');
  const email_login = await askQuestion('Email para el login: ');
  const password = await askQuestion('Password para el usuario: ');

  console.log('\n--- Resumen de Datos ---');
  console.log(`Persona:
  - Nombre: ${nombre}
  - Apellido: ${apellido}
  - DNI: ${dni}
  - Teléfono: ${telefono}`);
  console.log(`Usuario:
  - Email: ${email_login}
  - Password: [OCULTO]
  - Rol: Administrador`);
  console.log('------------------------\n');

  const confirmation = await askQuestion('¿Son correctos estos datos? (s/n): ');

  if (confirmation.toLowerCase() !== 's') {
    console.log('Operación cancelada por el usuario.');
    rl.close();
    process.exit(0);
  }

  // --- Conexión a la App de NestJS ---
  console.log('\nConectando a la aplicación...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuarioService = app.get(UsuarioService);
  const personaService = app.get(PersonaService);

  try {
    // Validar si el email ya existe ANTES de crear nada
    const userExists = await usuarioService.findOneByEmail(email_login);
    if (userExists) {
      throw new Error(`El email '${email_login}' ya está en uso.`);
    }

    console.log('Creando registro de Persona...');
    const nuevaPersona = await personaService.create({
      nombre,
      apellido,
      dni,
      telefono,
    });
    console.log(`-> Persona creada con ID: ${nuevaPersona.id_persona}`);

    console.log('Creando registro de Usuario...');
    const adminDto: CreateUsuarioAppDto = {
      email_login,
      password,
      rol: RolUsuario.ADMIN,
      id_persona: nuevaPersona.id_persona,
    };
    const nuevoAdmin = await usuarioService.create(adminDto);
    console.log(
      `-> Usuario administrador creado con email: ${nuevoAdmin.email_login}`,
    );

    console.log('\n¡Script de seeding completado exitosamente!');
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        '\nERROR: Ocurrió un error durante la creación:',
        error.message,
      );
    } else {
      console.error(
        '\nERROR: Ocurrió un error inesperado durante la creación:',
        error,
      );
    }
    process.exit(1);
  } finally {
    rl.close();
    await app.close();
  }
}

runSeed().catch((error) => {
  console.error('Error fatal en la ejecución del script:', error);
  process.exit(1);
});
