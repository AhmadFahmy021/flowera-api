import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable21781490293096 implements MigrationInterface {
  name = 'UpdateUserTable21781490293096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "NAME"`);
    await queryRunner.query(
      `ALTER TABLE "ADMIN" DROP CONSTRAINT "UQ_d2bfc4cdf88e55b670b3b31c8f6"`,
    );
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "USERNAME"`);
    await queryRunner.query(
      `ALTER TABLE "ADMIN" DROP CONSTRAINT "UQ_36271dd42ec0efc5f0850edcbb5"`,
    );
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "EMAIL"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "CREATED_AT"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "UPDATED_AT"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "DELETED_AT"`);
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "LEVEL" varchar2(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" DROP CONSTRAINT "FK_5c01b821747bd38f11d9a8d9cc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" MODIFY "USER_ID" number  NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD CONSTRAINT "FK_5c01b821747bd38f11d9a8d9cc2" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ADMIN" DROP CONSTRAINT "FK_5c01b821747bd38f11d9a8d9cc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" MODIFY "USER_ID" number  NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD CONSTRAINT "FK_5c01b821747bd38f11d9a8d9cc2" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`,
    );
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "LEVEL"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" ADD "DELETED_AT" timestamp`);
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "UPDATED_AT" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "CREATED_AT" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "EMAIL" varchar2(150) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD CONSTRAINT "UQ_36271dd42ec0efc5f0850edcbb5" UNIQUE ("EMAIL")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "USERNAME" varchar2(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD CONSTRAINT "UQ_d2bfc4cdf88e55b670b3b31c8f6" UNIQUE ("USERNAME")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "NAME" varchar2(100) NOT NULL`,
    );
  }
}
