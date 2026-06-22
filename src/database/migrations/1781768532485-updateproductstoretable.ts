import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateproductstoretable1781768532485 implements MigrationInterface {
    name = 'Updateproductstoretable1781768532485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "SLUG" varchar2(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "STORE" ADD "SLUG" varchar2(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "SLUG"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "SLUG"`);
    }

}
