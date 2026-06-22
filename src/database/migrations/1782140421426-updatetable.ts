import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782140421426 implements MigrationInterface {
    name = 'Updatetable1782140421426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SUB_PRODUCT_CATEGORIES" ADD "PRODUCT_CATEGORIES_ID" number`);
        await queryRunner.query(`ALTER TABLE "SUB_PRODUCT_CATEGORIES" ADD CONSTRAINT "FK_54b0724e93bec90e1feb9c135cb" FOREIGN KEY ("PRODUCT_CATEGORIES_ID") REFERENCES "PRODUCT_CATEGORIES" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SUB_PRODUCT_CATEGORIES" DROP CONSTRAINT "FK_54b0724e93bec90e1feb9c135cb"`);
        await queryRunner.query(`ALTER TABLE "SUB_PRODUCT_CATEGORIES" DROP COLUMN "PRODUCT_CATEGORIES_ID"`);
    }

}
