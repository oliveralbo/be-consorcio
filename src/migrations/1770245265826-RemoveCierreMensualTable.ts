import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCierreMensualTable1770245265826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Borramos la tabla si existe
        await queryRunner.query(`DROP TABLE IF EXISTS "cierre_mensual" CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // En el down (revertir), tendríamos que recrearla, pero como decidimos
        // eliminar esta lógica por completo, la dejamos vacía o recreamos la estructura básica.
        // Dado que queremos simplificar, no la recreamos para no ensuciar.
    }

}