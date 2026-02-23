import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpensaAndUnidadFuncional1770907715231 implements MigrationInterface {
    name = 'UpdateExpensaAndUnidadFuncional1770907715231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expensa" DROP COLUMN "pagado"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ADD "monto_base" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD "monto_pagado" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."expensa_estado_enum" AS ENUM('pendiente', 'parcial', 'pagado')`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD "estado" "public"."expensa_estado_enum" NOT NULL DEFAULT 'pendiente'`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD "fecha_vencimiento" date`);
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ALTER COLUMN "id_persona" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ALTER COLUMN "id_persona" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expensa" DROP COLUMN "fecha_vencimiento"`);
        await queryRunner.query(`ALTER TABLE "expensa" DROP COLUMN "estado"`);
        await queryRunner.query(`DROP TYPE "public"."expensa_estado_enum"`);
        await queryRunner.query(`ALTER TABLE "expensa" DROP COLUMN "monto_pagado"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" DROP COLUMN "monto_base"`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD "pagado" boolean NOT NULL DEFAULT false`);
    }

}
