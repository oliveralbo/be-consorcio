import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveActivoColumnFromUsuario1762571791918 implements MigrationInterface {
    name = 'RemoveActivoColumnFromUsuario1762571791918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP COLUMN "activo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD "activo" boolean NOT NULL DEFAULT true`);
    }

}
