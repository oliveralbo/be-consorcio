import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelefonoToPersonaAndPopulate1762965549100 implements MigrationInterface {
    name = 'AddTelefonoToPersonaAndPopulate1762965549100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "persona" ADD "telefono" character varying`);
        await queryRunner.query(`UPDATE "persona" SET "telefono" = floor(random() * 1000000000)::text WHERE "telefono" IS NULL`);
        await queryRunner.query(`ALTER TABLE "persona" ALTER COLUMN "telefono" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "persona" DROP COLUMN "telefono"`);
    }

}
