import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782593037064 implements MigrationInterface {
    name = 'Updatetable1782593037064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SYS_C00012_26062718:59:20$"`);
        // await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "SYS_NC00013$"`);
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" MODIFY "PAYMENT_TIME" date  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PAYMENT_ORDER" MODIFY "PAYMENT_TIME" date  NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "SYS_NC00013$" raw(126)`);
        // await queryRunner.query(`ALTER TABLE "ORDER" ADD "SYS_C00012_26062718:59:20$" number`);
    }

}
