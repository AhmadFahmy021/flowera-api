import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782580916730 implements MigrationInterface {
    name = 'Updatetable1782580916730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD "SHIPPING_COST" number`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "PROVINCE_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "CITY_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "DISTRICT_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "SUBDISTRICT_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "ZIP_CODE" varchar2(10)`);
        // await queryRunner.query(`ALTER TABLE "STORE" ADD "SUBDISTRICT_ID" varchar2(20)`);
        await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "SHIPPING_ADDRESS"  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" MODIFY "ADDRESS"  NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ADDRESS" MODIFY "ADDRESS" clob  NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "SHIPPING_ADDRESS" clob  NULL`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "SUBDISTRICT_ID"`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "ZIP_CODE"`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "SUBDISTRICT_NAME"`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "DISTRICT_NAME"`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "CITY_NAME"`);
        await queryRunner.query(`ALTER TABLE "STORE" DROP COLUMN "PROVINCE_NAME"`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "SHIPPING_COST"`);
    }

}
