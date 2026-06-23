import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782191906859 implements MigrationInterface {
  name = "Updatetable1782191906859";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "USERS"
      ADD "PHONE_NUMBER" VARCHAR2(10)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "USERS"
      DROP COLUMN "PHONE_NUMBER"
    `);
  }
}