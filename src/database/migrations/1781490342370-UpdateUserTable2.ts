import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable21781490342370 implements MigrationInterface {
  name = 'UpdateUserTable21781490342370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "CREATED_AT" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADMIN" ADD "UPDATED_AT" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ADMIN" ADD "DELETED_AT" timestamp`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "DELETED_AT"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "UPDATED_AT"`);
    await queryRunner.query(`ALTER TABLE "ADMIN" DROP COLUMN "CREATED_AT"`);
  }
}
