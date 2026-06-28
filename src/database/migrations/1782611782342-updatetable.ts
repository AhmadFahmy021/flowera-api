import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782611782342 implements MigrationInterface {
    name = 'Updatetable1782611782342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SYS_C00012_26062718:59:20$"`);
        // await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "SYS_NC00013$"`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_GATEWAY" varchar2(50) DEFAULT 'MIDTRANS' NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_CHANNEL" varchar2(100)`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "STATUS" varchar2(50) DEFAULT 'PENDING' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "REFERENCE_ID" varchar2(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD CONSTRAINT "UQ_822b86a4b1a0394ecf6e9b0d22e" UNIQUE ("REFERENCE_ID")`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "TRANSACTION_ID" varchar2(150)`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "SNAP_TOKEN" varchar2(300)`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_URL" clob`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "QR_STRING" clob`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "VA_NUMBER" varchar2(100)`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "BANK" varchar2(100)`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_RESPONSE" clob`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_METHOD"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_METHOD" varchar2(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "EXPIRED_PAYMENT_TIME"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "EXPIRED_PAYMENT_TIME" timestamp`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_TIME"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_TIME" timestamp`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_TIME"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_TIME" date`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "EXPIRED_PAYMENT_TIME"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "EXPIRED_PAYMENT_TIME" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_METHOD"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" ADD "PAYMENT_METHOD" varchar2(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_RESPONSE"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "BANK"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "VA_NUMBER"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "QR_STRING"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_URL"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "SNAP_TOKEN"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "TRANSACTION_ID"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP CONSTRAINT "UQ_822b86a4b1a0394ecf6e9b0d22e"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "REFERENCE_ID"`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "STATUS"`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_CHANNEL"`);
        // await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" DROP COLUMN "PAYMENT_GATEWAY"`);
        // await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "SYS_NC00013$" raw(126)`);
        // await queryRunner.query(`ALTER TABLE "ORDER" ADD "SYS_C00012_26062718:59:20$" number`);
    }

}
