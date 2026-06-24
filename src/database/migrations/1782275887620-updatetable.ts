import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782275887620 implements MigrationInterface {
    name = 'Updatetable1782275887620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "IS_DEFAULT"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD "IS_DEFAULT" number DEFAULT 1 NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP COLUMN "IS_DEFAULT"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" ADD "IS_DEFAULT" number DEFAULT 0 NOT NULL`);
    }

}
