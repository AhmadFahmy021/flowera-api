import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductSubscriptionTable1781501641165 implements MigrationInterface {
  name = 'CreateProductSubscriptionTable1781501641165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "PASSWORD" varchar2(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "PASSWORD"`);
  }
}
