import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePersonaMandatoryInUsuario1770339598996 implements MigrationInterface {
    name = 'MakePersonaMandatoryInUsuario1770339598996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ALTER COLUMN "id_persona" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_app" DROP CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2"`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ALTER COLUMN "id_persona" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario_app" ADD CONSTRAINT "FK_e989eb728569e6cce0bec7e36c2" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
