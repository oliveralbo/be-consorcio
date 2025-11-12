import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailAndTelefonoFromPersona1762704545251 implements MigrationInterface {
    name = 'RemoveEmailAndTelefonoFromPersona1762704545251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "persona" DROP CONSTRAINT "UQ_86ae2f9d6da4482363f832340bf"`);
        await queryRunner.query(`ALTER TABLE "persona" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "persona" DROP COLUMN "telefono"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "persona" ADD "telefono" character varying`);
        await queryRunner.query(`ALTER TABLE "persona" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persona" ADD CONSTRAINT "UQ_86ae2f9d6da4482363f832340bf" UNIQUE ("email")`);
    }

}
