import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762703636001 implements MigrationInterface {
    name = 'InitialSchema1762703636001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "persona" ("id_persona" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "email" character varying NOT NULL, "telefono" character varying, "dni" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_86ae2f9d6da4482363f832340bf" UNIQUE ("email"), CONSTRAINT "UQ_9be1c357217009199edce98d4db" UNIQUE ("dni"), CONSTRAINT "PK_a5b8321cce9bc11ca8931257ca3" PRIMARY KEY ("id_persona"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_app_rol_enum" AS ENUM('tesorero', 'vecino', 'administrador')`);
        await queryRunner.query(`CREATE TABLE "usuario_app" ("id_usuario" uuid NOT NULL DEFAULT uuid_generate_v4(), "email_login" character varying NOT NULL, "password" character varying NOT NULL, "rol" "public"."usuario_app_rol_enum" NOT NULL DEFAULT 'vecino', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id_persona" uuid, CONSTRAINT "UQ_fdf2281cf7a8fc7c8fae91d4c0a" UNIQUE ("email_login"), CONSTRAINT "REL_e989eb728569e6cce0bec7e36c" UNIQUE ("id_persona"), CONSTRAINT "PK_bd2372177b95d3c3b8349687f80" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`CREATE TABLE "unidad_funcional" ("id_unidad" uuid NOT NULL DEFAULT uuid_generate_v4(), "numero" character varying NOT NULL, "superficie" numeric(10,2) NOT NULL, "ambientes" integer NOT NULL, "coeficiente" numeric(5,4) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id_propietario" uuid, "id_inquilino" uuid, CONSTRAINT "PK_52a422df9a257725d85cb3e5c0b" PRIMARY KEY ("id_unidad"))`);
        await queryRunner.query(`CREATE TABLE "gasto" ("id_gasto" uuid NOT NULL DEFAULT uuid_generate_v4(), "concepto" character varying NOT NULL, "monto" numeric(10,2) NOT NULL, "fecha" date NOT NULL, "medio" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "registrado_por" uuid, CONSTRAINT "PK_bdd38041cc32b3a1a6b65f9142e" PRIMARY KEY ("id_gasto"))`);
        await queryRunner.query(`CREATE TYPE "public"."expensa_tipo_enum" AS ENUM('ordinaria', 'extraordinaria')`);
        await queryRunner.query(`CREATE TABLE "expensa" ("id_expensa" uuid NOT NULL DEFAULT uuid_generate_v4(), "mes" integer NOT NULL, "anio" integer NOT NULL, "tipo" "public"."expensa_tipo_enum" NOT NULL DEFAULT 'ordinaria', "monto" numeric(10,2) NOT NULL, "pagado" boolean NOT NULL DEFAULT false, "fecha_pago" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id_unidad" uuid, CONSTRAINT "PK_8648aca62fc2ae81f97fa13dac7" PRIMARY KEY ("id_expensa"))`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ADD CONSTRAINT "FK_e46be3233adb0ec44eaf8ea4fc3" FOREIGN KEY ("id_propietario") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ADD CONSTRAINT "FK_9bace30f244962f403c337a2f1f" FOREIGN KEY ("id_inquilino") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD CONSTRAINT "FK_545f48c196ad8154f9c5c3706f4" FOREIGN KEY ("registrado_por") REFERENCES "usuario_app"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD CONSTRAINT "FK_e7f7b8452d342102a8de31705a1" FOREIGN KEY ("id_unidad") REFERENCES "unidad_funcional"("id_unidad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expensa" DROP CONSTRAINT "FK_e7f7b8452d342102a8de31705a1"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP CONSTRAINT "FK_545f48c196ad8154f9c5c3706f4"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" DROP CONSTRAINT "FK_9bace30f244962f403c337a2f1f"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" DROP CONSTRAINT "FK_e46be3233adb0ec44eaf8ea4fc3"`);
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`);
        await queryRunner.query(`DROP TABLE "expensa"`);
        await queryRunner.query(`DROP TYPE "public"."expensa_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "gasto"`);
        await queryRunner.query(`DROP TABLE "unidad_funcional"`);
        await queryRunner.query(`DROP TABLE "usuario_app"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_app_rol_enum"`);
        await queryRunner.query(`DROP TABLE "persona"`);
    }

}
