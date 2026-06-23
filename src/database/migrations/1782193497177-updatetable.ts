import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782193497177 implements MigrationInterface {
    name = 'Updatetable1782193497177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "PHONE_NUMBER"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "PHONE_NUMBER" varchar2(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "PHONE_NUMBER"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "PHONE_NUMBER" varchar2(10)`);
    }

}
