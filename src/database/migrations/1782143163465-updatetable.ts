import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782143163465 implements MigrationInterface {
    name = 'Updatetable1782143163465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE PRODUCT DROP COLUMN DESCRIPTION
        `);

        await queryRunner.query(`
        ALTER TABLE PRODUCT ADD DESCRIPTION CLOB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT" MODIFY "DESCRIPTION" clob  NOT NULL`);
    }

}
