import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782152745342 implements MigrationInterface {
    name = 'Updatetable1782152745342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_fab5f4dd5075b7dd7e5e029404f"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_a6c1dac4ba5ebe8c3f9a9b941c4"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_9bd5b08e8a78db7cfc560d6f6fd"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "REL_fab5f4dd5075b7dd7e5e029404"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "REL_a6c1dac4ba5ebe8c3f9a9b941c"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "REL_8831619cf1f483a7b6dee5fe2c"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_fab5f4dd5075b7dd7e5e029404f" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_a6c1dac4ba5ebe8c3f9a9b941c4" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_9bd5b08e8a78db7cfc560d6f6fd" FOREIGN KEY ("ADDON_PRODUCT_ID") REFERENCES "ADDON_PRODUCT" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_9bd5b08e8a78db7cfc560d6f6fd"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_a6c1dac4ba5ebe8c3f9a9b941c4"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" DROP CONSTRAINT "FK_fab5f4dd5075b7dd7e5e029404f"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "REL_8831619cf1f483a7b6dee5fe2c" UNIQUE ("ADDON_PRODUCT_ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "REL_a6c1dac4ba5ebe8c3f9a9b941c" UNIQUE ("PRODUCT_VARIANT_ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "REL_fab5f4dd5075b7dd7e5e029404" UNIQUE ("PRODUCT_ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_9bd5b08e8a78db7cfc560d6f6fd" FOREIGN KEY ("ADDON_PRODUCT_ID") REFERENCES "ADDON_PRODUCT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_a6c1dac4ba5ebe8c3f9a9b941c4" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_IMAGE" ADD CONSTRAINT "FK_fab5f4dd5075b7dd7e5e029404f" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
    }

}
