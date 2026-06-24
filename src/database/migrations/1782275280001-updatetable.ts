import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782275280001 implements MigrationInterface {
    name = 'Updatetable1782275280001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" ADD "IS_DEFAULT" number DEFAULT 0 NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "IS_DEFAULT"`);
    }

}
