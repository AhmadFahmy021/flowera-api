import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782586699882 implements MigrationInterface {
    name = 'Updatetable1782586699882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "ORIGIN"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "DESTINATION"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "COURIER"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "COURIER_SERVICE"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_COST"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_ETD"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "WEIGHT"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "RECEIPT_NUMBER"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_ADDRESS"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SYS_C00010_26062714:47:08$"`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "ITEMS_TOTAL" number NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "SHIPPING_TOTAL" number  NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD "COURIER_NAME" varchar2(100)`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD "COURIER_SERVICE" varchar2(100)`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD "SHIPPING_ETD" varchar2(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "SHIPPING_ETD"`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "COURIER_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "COURIER_NAME"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_TOTAL"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "ITEMS_TOTAL"`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "SYS_C00010_26062714:47:08$" varchar2(20)`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "SHIPPING_ADDRESS" clob NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "RECEIPT_NUMBER" varchar2(100)`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "WEIGHT" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "SHIPPING_ETD" varchar2(50)`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "SHIPPING_COST" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "COURIER_SERVICE" varchar2(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "COURIER" varchar2(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "DESTINATION" varchar2(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" ADD "ORIGIN" varchar2(20) NOT NULL`);
    }

}
