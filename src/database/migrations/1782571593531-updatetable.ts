import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782571593531 implements MigrationInterface {
    name = 'Updatetable1782571593531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Rename DISSCOUNT → DISCOUNT if old column still exists
        try {
            await queryRunner.query(`ALTER TABLE "ORDER_ITEM" RENAME COLUMN "DISSCOUNT" TO "DISCOUNT"`);
        } catch (_) { /* already correct or already renamed */ }

        // 2. Add new columns (wrap each — may already exist from failed attempt)
        const tryAdd = async (sql: string) => {
            try { await queryRunner.query(sql); } catch (_) { /* column may already exist */ }
        };

        await tryAdd(`ALTER TABLE "ORDER" ADD "ORIGIN" varchar2(20) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "DESTINATION" varchar2(20) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "COURIER" varchar2(100) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "COURIER_SERVICE" varchar2(100) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "SHIPPING_COST" number NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "SHIPPING_ETD" varchar2(50) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "WEIGHT" number NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "RECEIPT_NUMBER" varchar2(100) NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "SHIPPING_ADDRESS" clob NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "NOTE" clob NULL`);
        await tryAdd(`ALTER TABLE "ORDER" ADD "USER_ID" number NULL`);
        await tryAdd(`ALTER TABLE "ORDER_ITEM" ADD "PRICE" number NULL`);
        await tryAdd(`ALTER TABLE "ORDER_ITEM" ADD "SUB_TOTAL" number NULL`);

        // Also add DISCOUNT if rename above didn't work but column doesn't exist
        await tryAdd(`ALTER TABLE "ORDER_ITEM" ADD "DISCOUNT" number NULL`);

        // 3. Set default values for existing NULL rows
        try {
            await queryRunner.query(`UPDATE "ORDER" SET "ORIGIN" = '0', "DESTINATION" = '0', "COURIER" = '-', "COURIER_SERVICE" = '-', "SHIPPING_COST" = 0, "WEIGHT" = 0, "SHIPPING_ADDRESS" = '-' WHERE "ORIGIN" IS NULL`);
        } catch (_) { /* ignore update errors */ }

        // 4. Make shipping columns NOT NULL
        const tryNotNull = async (sql: string) => {
            try { await queryRunner.query(sql); } catch (_) { /* may already be NOT NULL */ }
        };
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "ORIGIN" varchar2(20) NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "DESTINATION" varchar2(20) NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "COURIER" varchar2(100) NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "COURIER_SERVICE" varchar2(100) NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "SHIPPING_COST" number NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "WEIGHT" number NOT NULL`);
        await tryNotNull(`ALTER TABLE "ORDER" MODIFY "SHIPPING_ADDRESS" clob NOT NULL`);

        // 5. Make IS_CUSTOMER_CONFIRMED nullable
        try { await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "IS_CUSTOMER_CONFIRMED" varchar2(150) NULL`); } catch (_) {}

        // 6. Drop old UNIQUE constraints (OneToOne→ManyToOne)
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "REL_43753526d133eff3026a384eca"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "REL_6e1302dd72772d4d3672e2eb73"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "REL_83568506245a6ee3249c0823bf"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "REL_ca60b440157c8adc7cdb3b5348"`); } catch (_) {}

        // 7. Make ADDON_PRODUCT nullable
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "ADDON_PRODUCT" clob NULL`); } catch (_) {}

        // 8. Add FK for USER_ID
        try { await queryRunner.query(`ALTER TABLE "ORDER" ADD CONSTRAINT "FK_ce716ba1a59f7812f19579b3ab0" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`); } catch (_) {}

        // 9. Drop old FKs and re-add (idempotent via try/catch)
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_43753526d133eff3026a384ecad"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_6e1302dd72772d4d3672e2eb739"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_83568506245a6ee3249c0823bf8"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_ca60b440157c8adc7cdb3b53484"`); } catch (_) {}

        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_43753526d133eff3026a384ecad" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_6e1302dd72772d4d3672e2eb739" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_83568506245a6ee3249c0823bf8" FOREIGN KEY ("ORDER_ID") REFERENCES "ORDER" ("ID")`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_ca60b440157c8adc7cdb3b53484" FOREIGN KEY ("STORE_ID") REFERENCES "STORE" ("ID")`); } catch (_) {}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse FK drops (may not exist if previously rolled back)
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_ca60b440157c8adc7cdb3b53484"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_83568506245a6ee3249c0823bf8"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_6e1302dd72772d4d3672e2eb739"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "FK_43753526d133eff3026a384ecad"`); } catch (_) {}
        try { await queryRunner.query(`ALTER TABLE "ORDER" DROP CONSTRAINT "FK_ce716ba1a59f7812f19579b3ab0"`); } catch (_) {}

        // Restore old UNIQUE constraints
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "REL_ca60b440157c8adc7cdb3b5348" UNIQUE ("STORE_ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "REL_83568506245a6ee3249c0823bf" UNIQUE ("ORDER_ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "REL_6e1302dd72772d4d3672e2eb73" UNIQUE ("PRODUCT_VARIANT_ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "REL_43753526d133eff3026a384eca" UNIQUE ("PRODUCT_ID")`);

        // Restore old FKs
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_ca60b440157c8adc7cdb3b53484" FOREIGN KEY ("STORE_ID") REFERENCES "STORE" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_83568506245a6ee3249c0823bf8" FOREIGN KEY ("ORDER_ID") REFERENCES "ORDER" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_6e1302dd72772d4d3672e2eb739" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" ADD CONSTRAINT "FK_43753526d133eff3026a384ecad" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);

        // Drop new columns
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "SUB_TOTAL"`);
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" DROP COLUMN "PRICE"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "NOTE"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_ADDRESS"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "RECEIPT_NUMBER"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "WEIGHT"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_ETD"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "SHIPPING_COST"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "COURIER_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "COURIER"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "DESTINATION"`);
        await queryRunner.query(`ALTER TABLE "ORDER" DROP COLUMN "ORIGIN"`);

        // Rename DISCOUNT back to DISSCOUNT
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" RENAME COLUMN "DISCOUNT" TO "DISSCOUNT"`);

        // Restore old state
        await queryRunner.query(`ALTER TABLE "ORDER_ITEM" MODIFY "ADDON_PRODUCT" clob NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ORDER" MODIFY "IS_CUSTOMER_CONFIRMED" varchar2(150) NOT NULL`);
    }

}
