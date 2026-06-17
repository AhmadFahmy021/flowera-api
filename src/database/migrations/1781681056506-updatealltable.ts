import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatealltable1781681056506 implements MigrationInterface {
  name = 'Updatealltable1781681056506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "GOOGLE_ID" varchar2(255)`,
    );
    await queryRunner.query(`ALTER TABLE "USERS" ADD "AVATAR" varchar2(500)`);
    await queryRunner.query(`ALTER TABLE "USERS" ADD "REFRESH_TOKEN" clob`);
    await queryRunner.query(
      `ALTER TABLE "USERS" MODIFY "PASSWORD" varchar2(255)  NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" MODIFY "PASSWORD" varchar2(255)  NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "REFRESH_TOKEN"`);
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "AVATAR"`);
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "GOOGLE_ID"`);
  }
}
