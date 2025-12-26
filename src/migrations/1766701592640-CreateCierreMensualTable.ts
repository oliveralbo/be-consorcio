import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCierreMensualTable1766701592640
  implements MigrationInterface
{
  name = 'CreateCierreMensualTable1766701592640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`,
    );
    await queryRunner.query(
      `CREATE TABLE "cierre_mensual" ("id_cierre_mensual" uuid NOT NULL DEFAULT uuid_generate_v4(), "mes" integer NOT NULL, "anio" integer NOT NULL, "balanceInicial" numeric(10,2) NOT NULL DEFAULT '0', "totalIngresos" numeric(10,2) NOT NULL DEFAULT '0', "totalEgresos" numeric(10,2) NOT NULL DEFAULT '0', "balanceFinal" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_be05e7bfca579b189ed2f20ea26" UNIQUE ("mes", "anio"), CONSTRAINT "PK_9a9c8c1aef19aab3bc30c7d6550" PRIMARY KEY ("id_cierre_mensual"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`,
    );
    await queryRunner.query(`DROP TABLE "cierre_mensual"`);
    await queryRunner.query(
      `ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
