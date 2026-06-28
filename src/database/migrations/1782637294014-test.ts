import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1782637294014 implements MigrationInterface {
    name = 'Test1782637294014'

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
