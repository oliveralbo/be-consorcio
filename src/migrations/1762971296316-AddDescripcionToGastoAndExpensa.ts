import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescripcionToGastoAndExpensa1762971296316 implements MigrationInterface {
    name = 'AddDescripcionToGastoAndExpensa1762971296316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gasto" ADD "descripcion" text`);
        await queryRunner.query(`ALTER TABLE "expensa" ADD "descripcion" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expensa" DROP COLUMN "descripcion"`);
        await queryRunner.query(`ALTER TABLE "gasto" DROP COLUMN "descripcion"`);
    }

}
