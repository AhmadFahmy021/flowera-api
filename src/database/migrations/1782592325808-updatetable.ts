import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782592325808 implements MigrationInterface {
    name = 'Updatetable1782592325808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SYS_C00012_26062718:59:20$"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "WEIGHT" number DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT" DROP COLUMN "WEIGHT"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" ADD "SYS_C00012_26062718:59:20$" number`);
    }

}
