import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPisoRemoveCoeficienteUnidadFuncional1762733731934 implements MigrationInterface {
    name = 'AddPisoRemoveCoeficienteUnidadFuncional1762733731934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unidad_funcional" DROP COLUMN "coeficiente"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ADD "piso" character varying NOT NULL DEFAULT 'PB'`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ALTER COLUMN "superficie" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ALTER COLUMN "superficie" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" DROP COLUMN "piso"`);
        await queryRunner.query(`ALTER TABLE "unidad_funcional" ADD "coeficiente" numeric(5,4) NOT NULL`);
    }

}
