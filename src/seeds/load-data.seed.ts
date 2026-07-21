import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, Repository } from 'typeorm';
import { Persona } from '../modules/persona/persona.entity';
import { UsuarioApp, RolUsuario } from '../modules/usuario/usuario.entity';
import { UnidadFuncional } from '../modules/unidad-funcional/unidad-funcional.entity';
import {
  Expensa,
  TipoExpensa,
  EstadoExpensa,
} from '../modules/expensa/expensa.entity';
import { Gasto, TipoGasto } from '../modules/gasto/gasto.entity';

// ─── Tipos ─────────────────────────────────────────────────────────

type PersonaData = {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
};

type UsuarioData = {
  email: string;
  password: string;
  rol: RolUsuario;
  personaIdx: number;
};

type UnidadData = {
  numero: string;
  piso: string;
  ambientes: number;
  superficie: number;
  monto_base: number;
  propietarioIdx: number;
  inquilinoIdx?: number;
};

type PagoInfo = {
  monto_pagado: number;
  fecha_pago?: Date;
};

// ─── Datos ─────────────────────────────────────────────────────────

const PERSONAS: PersonaData[] = [
  {
    nombre: 'Carlos',
    apellido: 'García',
    dni: '20123456',
    telefono: '1123456789',
  },
  {
    nombre: 'María',
    apellido: 'López',
    dni: '21234567',
    telefono: '1123456790',
  },
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '22345678',
    telefono: '1123456791',
  },
  {
    nombre: 'Ana',
    apellido: 'Martínez',
    dni: '23456789',
    telefono: '1123456792',
  },
  {
    nombre: 'Roberto',
    apellido: 'Fernández',
    dni: '24567890',
    telefono: '1123456793',
  },
  {
    nombre: 'Laura',
    apellido: 'Rodríguez',
    dni: '25678901',
    telefono: '1123456794',
  },
  {
    nombre: 'Diego',
    apellido: 'Sánchez',
    dni: '26789012',
    telefono: '1123456795',
  },
  {
    nombre: 'Sofía',
    apellido: 'Torres',
    dni: '27890123',
    telefono: '1123456796',
  },
  {
    nombre: 'Pedro',
    apellido: 'Gómez',
    dni: '28901234',
    telefono: '1123456797',
  },
  {
    nombre: 'Miguel',
    apellido: 'Ángel',
    dni: '29012345',
    telefono: '1123456798',
  },
  {
    nombre: 'Lucía',
    apellido: 'Ramírez',
    dni: '30123456',
    telefono: '1123456799',
  },
  {
    nombre: 'Martín',
    apellido: 'Díaz',
    dni: '31234567',
    telefono: '1123456800',
  },
];

const USUARIOS: UsuarioData[] = [
  {
    email: 'carlos.garcia@email.com',
    password: 'admin123',
    rol: RolUsuario.ADMIN,
    personaIdx: 0,
  },
  {
    email: 'maria.lopez@email.com',
    password: 'tesorero123',
    rol: RolUsuario.TESORERO,
    personaIdx: 1,
  },
  {
    email: 'juan.perez@email.com',
    password: 'vecino123',
    rol: RolUsuario.VECINO,
    personaIdx: 2,
  },
  {
    email: 'ana.martinez@email.com',
    password: 'vecino123',
    rol: RolUsuario.VECINO,
    personaIdx: 3,
  },
  {
    email: 'roberto.fernandez@email.com',
    password: 'vecino123',
    rol: RolUsuario.VECINO,
    personaIdx: 4,
  },
  {
    email: 'laura.rodriguez@email.com',
    password: 'vecino123',
    rol: RolUsuario.VECINO,
    personaIdx: 5,
  },
  {
    email: 'diego.sanchez@email.com',
    password: 'vecino123',
    rol: RolUsuario.VECINO,
    personaIdx: 6,
  },
];

const UNIDADES: UnidadData[] = [
  {
    numero: 'PH 1',
    piso: 'PB',
    ambientes: 2,
    superficie: 45,
    monto_base: 15000,
    propietarioIdx: 2,
  },
  {
    numero: 'PH 2',
    piso: 'PB',
    ambientes: 3,
    superficie: 60,
    monto_base: 18000,
    propietarioIdx: 3,
  },
  {
    numero: 'Piso 1A',
    piso: '1',
    ambientes: 2,
    superficie: 50,
    monto_base: 15000,
    propietarioIdx: 4,
    inquilinoIdx: 8,
  },
  {
    numero: 'Piso 1B',
    piso: '1',
    ambientes: 1,
    superficie: 35,
    monto_base: 12000,
    propietarioIdx: 5,
  },
  {
    numero: 'Piso 2A',
    piso: '2',
    ambientes: 3,
    superficie: 70,
    monto_base: 20000,
    propietarioIdx: 0,
  },
  {
    numero: 'Piso 2B',
    piso: '2',
    ambientes: 2,
    superficie: 55,
    monto_base: 16000,
    propietarioIdx: 6,
  },
  {
    numero: 'Piso 3A',
    piso: '3',
    ambientes: 2,
    superficie: 50,
    monto_base: 16000,
    propietarioIdx: 1,
  },
  {
    numero: 'Piso 3B',
    piso: '3',
    ambientes: 4,
    superficie: 85,
    monto_base: 25000,
    propietarioIdx: 7,
    inquilinoIdx: 9,
  },
  {
    numero: 'Local 1',
    piso: 'PB',
    ambientes: 1,
    superficie: 30,
    monto_base: 30000,
    propietarioIdx: 5,
  },
  {
    numero: 'Local 2',
    piso: 'PB',
    ambientes: 1,
    superficie: 40,
    monto_base: 35000,
    propietarioIdx: 6,
  },
];

const GASTOS_MENSUALES = [
  {
    concepto: 'Electricidad',
    descripcion: 'Factura de electricidad',
    monto: 25000,
    medio: 'Transferencia',
  },
  {
    concepto: 'Agua',
    descripcion: 'Factura de agua',
    monto: 8000,
    medio: 'Transferencia',
  },
  {
    concepto: 'Gas',
    descripcion: 'Factura de gas',
    monto: 12000,
    medio: 'Transferencia',
  },
  {
    concepto: 'Limpieza',
    descripcion: 'Servicio de limpieza mensual',
    monto: 15000,
    medio: 'Efectivo',
  },
  {
    concepto: 'Seguro edificio',
    descripcion: 'Seguro de edificio',
    monto: 10000,
    medio: 'Transferencia',
  },
  {
    concepto: 'Mantenimiento ascensor',
    descripcion: 'Mantenimiento mensual del ascensor',
    monto: 18000,
    medio: 'Transferencia',
  },
];

const GASTOS_EXTRAORDINARIOS: Array<{
  mes: number;
  concepto: string;
  descripcion: string;
  monto: number;
  medio: string;
}> = [
  {
    mes: 1,
    concepto: 'Reparación bomba de agua',
    descripcion: 'Reparación urgente de bomba de agua del tanque',
    monto: 45000,
    medio: 'Efectivo',
  },
  {
    mes: 2,
    concepto: 'Pintura de fachada',
    descripcion: 'Pintura completa de la fachada del edificio',
    monto: 120000,
    medio: 'Transferencia',
  },
  {
    mes: 3,
    concepto: 'Reparación de plomería',
    descripcion: 'Arreglo de cañería rota en pasillo principal',
    monto: 25000,
    medio: 'Efectivo',
  },
  {
    mes: 4,
    concepto: 'Portón eléctrico',
    descripcion: 'Instalación de nuevo portón eléctrico automático',
    monto: 85000,
    medio: 'Transferencia',
  },
  {
    mes: 5,
    concepto: 'Fumigación general',
    descripcion: 'Fumigación contra plagas en áreas comunes',
    monto: 18000,
    medio: 'Efectivo',
  },
  {
    mes: 6,
    concepto: 'Reparación de techo',
    descripcion: 'Reparación de filtraciones en terraza',
    monto: 95000,
    medio: 'Transferencia',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

function fechaUtc(anio: number, mes: number, dia: number): Date {
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function determinarEstado(monto: number, montoPagado: number): EstadoExpensa {
  if (montoPagado >= monto) return EstadoExpensa.PAGADO;
  if (montoPagado > 0) return EstadoExpensa.PARCIAL;
  return EstadoExpensa.PENDIENTE;
}

// Perfiles de pago por unidad para cada mes (enero-junio 2026)
function getPago(
  unidadIdx: number,
  mesOffset: number,
  anio: number,
  mes: number,
): PagoInfo {
  const montoBase = UNIDADES[unidadIdx].monto_base;

  const completo = (dia: number, mp?: number): PagoInfo => ({
    monto_pagado: montoBase,
    fecha_pago: fechaUtc(anio, mp ?? mes, dia),
  });

  const parcial = (pct: number, dia: number, mp?: number): PagoInfo => ({
    monto_pagado: Math.round(montoBase * pct),
    fecha_pago: fechaUtc(anio, mp ?? mes, dia),
  });

  const vacio = (): PagoInfo => ({ monto_pagado: 0 });

  switch (unidadIdx) {
    // PH 1 - Juan Pérez: paga siempre a tiempo (1-12 del mes)
    case 0:
      return completo([12, 10, 8, 12, 9, 11][mesOffset]);

    // PH 2 - Ana Martínez: paga con retraso (después del 15)
    case 1:
      return mesOffset < 5
        ? completo([25, 20, 15, 28, 18][mesOffset])
        : completo(5, 7); // junio pagado en julio

    // Piso 1A - Roberto Fernández (inquilino Pedro Gómez): pagos parciales
    case 2: {
      const planes: PagoInfo[] = [
        parcial(0.67, 20), // $10000
        parcial(0.53, 18), // $8000
        parcial(0.8, 22), // $12000
        vacio(), // nada
        parcial(0.33, 15), // $5000
        vacio(), // nada
      ];
      return planes[mesOffset];
    }

    // Piso 1B - Laura Rodríguez: paga a tiempo
    case 3:
      return completo([5, 7, 4, 8, 6, 9][mesOffset]);

    // Piso 2A - Carlos García (admin): paga siempre los primeros días
    case 4:
      return completo([3, 5, 2, 4, 7, 6][mesOffset]);

    // Piso 2B - Diego Sánchez: pagó ene/feb, dejó de pagar desde marzo
    case 5:
      return mesOffset <= 1 ? completo([10, 8][mesOffset]) : vacio();

    // Piso 3A - María López (tesorero): paga siempre
    case 6:
      return completo([6, 4, 7, 5, 3, 8][mesOffset]);

    // Piso 3B - Sofía Torres (inquilino Miguel Ángel): paga el mes siguiente
    case 7:
      return completo(5, mes + 1);

    // Local 1 - Laura Rodríguez: paga a tiempo
    case 8:
      return completo([8, 6, 9, 7, 5, 10][mesOffset]);

    // Local 2 - Diego Sánchez: nunca paga
    case 9:
      return vacio();

    default:
      return vacio();
  }
}

// ─── Seed ──────────────────────────────────────────────────────────

async function runSeed() {
  console.log('=== Carga de datos de semilla — be-consorcio ===\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const ds: DataSource = app.get(DataSource);

  const personaRepo: Repository<Persona> = ds.getRepository(Persona);
  const usuarioRepo: Repository<UsuarioApp> = ds.getRepository(UsuarioApp);
  const unidadRepo: Repository<UnidadFuncional> =
    ds.getRepository(UnidadFuncional);
  const expensaRepo: Repository<Expensa> = ds.getRepository(Expensa);
  const gastoRepo: Repository<Gasto> = ds.getRepository(Gasto);

  try {
    const existentes = await personaRepo.count();
    if (existentes > 0) {
      console.log('Limpiando datos existentes...');
      await expensaRepo.createQueryBuilder().delete().execute();
      await gastoRepo.createQueryBuilder().delete().execute();
      await unidadRepo.createQueryBuilder().delete().execute();
      await usuarioRepo.createQueryBuilder().delete().execute();
      await personaRepo.createQueryBuilder().delete().execute();
      console.log('  Datos anteriores eliminados.\n');
    }

    // ── 1. Personas ──────────────────────────────────────────────
    console.log('1. Creando personas...');
    const personas = await personaRepo.save(
      PERSONAS.map((p) => personaRepo.create(p)),
    );
    console.log(`   ${personas.length} personas creadas.`);

    // ── 2. Usuarios ──────────────────────────────────────────────
    console.log('2. Creando usuarios...');
    const usuarios = await usuarioRepo.save(
      USUARIOS.map((u) =>
        usuarioRepo.create({
          email_login: u.email,
          password: u.password,
          rol: u.rol,
          persona: personas[u.personaIdx],
        }),
      ),
    );
    console.log(`   ${usuarios.length} usuarios creados.`);

    // ── 3. Unidades Funcionales ──────────────────────────────────
    console.log('3. Creando unidades funcionales...');
    const unidades = await unidadRepo.save(
      UNIDADES.map((u) =>
        unidadRepo.create({
          numero: u.numero,
          piso: u.piso,
          ambientes: u.ambientes,
          superficie: u.superficie,
          monto_base: u.monto_base,
          propietario: personas[u.propietarioIdx],
          inquilino: u.inquilinoIdx != null ? personas[u.inquilinoIdx] : null,
        }),
      ),
    );
    console.log(`   ${unidades.length} unidades creadas.`);

    // ── 4. Expensas (Ene–Jun 2026) ───────────────────────────────
    console.log('4. Creando expensas (enero - junio 2026)...');
    let totalExpensas = 0;

    for (let mes = 1; mes <= 6; mes++) {
      const anio = 2026;
      for (let uIdx = 0; uIdx < UNIDADES.length; uIdx++) {
        const pago = getPago(uIdx, mes - 1, anio, mes);
        await expensaRepo.save(
          expensaRepo.create({
            unidad: unidades[uIdx],
            mes,
            anio,
            tipo: TipoExpensa.ORDINARIA,
            monto: UNIDADES[uIdx].monto_base,
            monto_pagado: pago.monto_pagado,
            estado: determinarEstado(
              UNIDADES[uIdx].monto_base,
              pago.monto_pagado,
            ),
            fecha_vencimiento: fechaUtc(anio, mes, 10),
            fecha_pago: pago.fecha_pago,
            descripcion: `Expensa ordinaria ${mes}/${anio} - ${UNIDADES[uIdx].numero}`,
          }),
        );
        totalExpensas++;
      }
    }
    console.log(`   ${totalExpensas} expensas creadas.`);

    // ── 5. Gastos ────────────────────────────────────────────────
    console.log('5. Creando gastos...');
    const admin = usuarios[0];
    let totalGastos = 0;

    for (let mes = 1; mes <= 6; mes++) {
      const anio = 2026;

      for (const g of GASTOS_MENSUALES) {
        await gastoRepo.save(
          gastoRepo.create({
            concepto: g.concepto,
            descripcion: `${g.descripcion} — ${mes}/${anio}`,
            monto: g.monto,
            fecha: fechaUtc(anio, mes, 1),
            medio: g.medio,
            tipo: TipoGasto.MENSUAL,
            registrado_por: admin,
          }),
        );
        totalGastos++;
      }

      const extra = GASTOS_EXTRAORDINARIOS.find((e) => e.mes === mes);
      if (extra) {
        await gastoRepo.save(
          gastoRepo.create({
            concepto: extra.concepto,
            descripcion: extra.descripcion,
            monto: extra.monto,
            fecha: fechaUtc(anio, mes, 15),
            medio: extra.medio,
            tipo: TipoGasto.EXTRAORDINARIO,
            registrado_por: admin,
          }),
        );
        totalGastos++;
      }
    }
    console.log(`   ${totalGastos} gastos creados.`);

    // ── Resumen ──────────────────────────────────────────────────
    console.log('\n=== ¡Carga completada! ===\n');
    console.log('Resumen:');
    console.log(`  Personas:           ${personas.length}`);
    console.log(`  Usuarios:           ${usuarios.length}`);
    console.log(`  Unidades:           ${unidades.length}`);
    console.log(`  Expensas (6 meses): ${totalExpensas}`);
    console.log(`  Gastos:             ${totalGastos}`);
    console.log('\nUsuarios disponibles:');
    console.log('  ADMIN    → carlos.garcia@email.com / admin123');
    console.log('  TESORERO → maria.lopez@email.com / tesorero123');
    console.log('  VECINO   → juan.perez@email.com / vecino123');
    console.log('  VECINO   → ana.martinez@email.com / vecino123');
    console.log('  VECINO   → roberto.fernandez@email.com / vecino123');
    console.log('  VECINO   → laura.rodriguez@email.com / vecino123');
    console.log('  VECINO   → diego.sanchez@email.com / vecino123');

    console.log('\nCasuísticas incluidas:');
    console.log('  ✓ Propietarios que pagan siempre a tiempo');
    console.log('  ✓ Propietarios que pagan con retraso');
    console.log('  ✓ Pagos parciales (deudores parciales)');
    console.log('  ✓ Deudores totales (no pagan desde marzo)');
    console.log('  ✓ Unidades con inquilinos');
    console.log('  ✓ Locales comerciales');
    console.log('  ✓ Gastos mensuales recurrentes');
    console.log('  ✓ Gastos extraordinarios (reparaciones)');
  } catch (error) {
    console.error('\nERROR:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

void runSeed();
