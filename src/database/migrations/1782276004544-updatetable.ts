import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782276004544 implements MigrationInterface {
    name = 'Updatetable1782276004544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" MODIFY "IS_DEFAULT" number DEFAULT 0 `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" MODIFY "IS_DEFAULT" number DEFAULT 1 `);
    }

}
