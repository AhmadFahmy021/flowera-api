import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestoretable1782041499574 implements MigrationInterface {
    name = 'Updatestoretable1782041499574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STORE" MODIFY "LOGO" varchar2(255)  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STORE" MODIFY "LOGO" varchar2(255)  NOT NULL`);
    }

}
