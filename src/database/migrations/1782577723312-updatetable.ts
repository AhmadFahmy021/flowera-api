import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782577723312 implements MigrationInterface {
    name = 'Updatetable1782577723312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD "REPLY_NOTE" varchar2(500)`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD "STATUS" varchar2(50) DEFAULT 'PENDING' NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "PROVINCE_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "CITY_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "DISTRICT_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "SUBDISTRICT_NAME" varchar2(200)`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "ZIP_CODE" varchar2(10)`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "SUBDISTRICT_ID" varchar2(20)`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "FK_ed01ab0a02653f5c7cdd397d40a"`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "FK_9b73b9fe176fb35b0070c7b185b"`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP COLUMN "NOTE"`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD "NOTE" varchar2(500)`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "REL_ed01ab0a02653f5c7cdd397d40"`);
        // await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "REL_9b73b9fe176fb35b0070c7b185"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "SHIPPING_ADDRESS" clob  NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "DISCOUNT" number  NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "ADDON_PRODUCT" clob  NULL`);
        // await queryRunner.query(`ALTER TABLE "ADDRESS" MODIFY "ADDRESS" clob  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "FK_ed01ab0a02653f5c7cdd397d40a" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "FK_9b73b9fe176fb35b0070c7b185b" FOREIGN KEY ("ORDER_ID") REFERENCES "ORDER" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "FK_9b73b9fe176fb35b0070c7b185b"`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP CONSTRAINT "FK_ed01ab0a02653f5c7cdd397d40a"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" MODIFY "ADDRESS" clob  NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "ADDON_PRODUCT" clob  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "DISCOUNT" number  NULL`);
        // await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "SHIPPING_ADDRESS" clob  NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "REL_9b73b9fe176fb35b0070c7b185" UNIQUE ("ORDER_ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "REL_ed01ab0a02653f5c7cdd397d40" UNIQUE ("USER_ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP COLUMN "NOTE"`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD "NOTE" varchar2(160) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "FK_9b73b9fe176fb35b0070c7b185b" FOREIGN KEY ("ORDER_ID") REFERENCES "ORDER" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" ADD CONSTRAINT "FK_ed01ab0a02653f5c7cdd397d40a" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "SUBDISTRICT_ID"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "ZIP_CODE"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "SUBDISTRICT_NAME"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "DISTRICT_NAME"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "CITY_NAME"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "PROVINCE_NAME"`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP COLUMN "STATUS"`);
        await queryRunner.query(`ALTER TABLE "ORDER_IMAGE_CONFIRMED" DROP COLUMN "REPLY_NOTE"`);
        // await queryRunner.query(`ALTER TABLE "ORDER" ADD "SYS_C00010_26062714:47:08$" varchar2(20)`);
    }

}
