import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoToGasto1774224767417 implements MigrationInterface {
    name = 'AddTipoToGasto1774224767417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."gasto_tipo_enum" AS ENUM('mensual', 'extraordinario')`);
        await queryRunner.query(`ALTER TABLE "gasto" ADD "tipo" "public"."gasto_tipo_enum" NOT NULL DEFAULT 'mensual'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gasto" DROP COLUMN "tipo"`);
        await queryRunner.query(`DROP TYPE "public"."gasto_tipo_enum"`);
    }

}
