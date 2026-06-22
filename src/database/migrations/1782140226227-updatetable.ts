import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782140226227 implements MigrationInterface {
    name = 'Updatetable1782140226227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_CATEGORIES" RENAME COLUMN "title" TO "TITLE"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_CATEGORIES" RENAME COLUMN "TITLE" TO "title"`);
    }

}
