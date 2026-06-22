import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782141850315 implements MigrationInterface {
    name = 'Updatetable1782141850315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "SUB_PRODUCT_CATEGORIES_ID" number`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "STORE_ID" number`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD CONSTRAINT "FK_0f575579b3743f03a87d1ac47d8" FOREIGN KEY ("SUB_PRODUCT_CATEGORIES_ID") REFERENCES "SUB_PRODUCT_CATEGORIES" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD CONSTRAINT "FK_7bb7cecd51fc0a3e5a7810385b6" FOREIGN KEY ("STORE_ID") REFERENCES "STORE" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP CONSTRAINT "FK_7bb7cecd51fc0a3e5a7810385b6"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP CONSTRAINT "FK_0f575579b3743f03a87d1ac47d8"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "STORE_ID"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "SUB_PRODUCT_CATEGORIES_ID"`);
    }

}
