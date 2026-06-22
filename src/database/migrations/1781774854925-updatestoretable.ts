import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestoretable1781774854925 implements MigrationInterface {
    name = 'Updatestoretable1781774854925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STORE" ADD "LOGO" varchar2(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "LOGO"`);
    }

}
