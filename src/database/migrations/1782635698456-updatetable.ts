import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class Updatetable1782635698456 implements MigrationInterface {
    name = 'Updatetable1782635698456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
        "ORDER",
        new TableColumn({
            name: "ADDRESS_ID",
            type: "number",
            isNullable: true,
        }),
    );

            await queryRunner.createForeignKey(
            "ORDER",
            new TableForeignKey({
                columnNames: ["ADDRESS_ID"],
                referencedTableName: "ADDRESS",
                referencedColumnNames: ["ID"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ORDER" DROP CONSTRAINT "FK_2b028b7b31f723e0014221be81a"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT" ADD "SYS_NC00013$" raw(126)`);
        await queryRunner.query(`ALTER TABLE "ORDER" RENAME COLUMN "ADDRESS_ID" TO "SYS_C00012_26062718:59:20$"`);
    }

}
