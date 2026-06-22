import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatetable1782140735233 implements MigrationInterface {
    name = 'Updatetable1782140735233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FAQ_STORE" ADD "STORE_ID" number`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" ADD "PRODUCT_ID" number`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" ADD "PRODUCT_VARIANT_ID" number`);
        await queryRunner.query(`ALTER TABLE "CART" ADD "USER_ID" number`);
        await queryRunner.query(`ALTER TABLE "CART" ADD "PRODUCT_ID" number`);
        await queryRunner.query(`ALTER TABLE "CART" ADD "PRODUCT_VARIANT_ID" number`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" ADD "PRODUCT_ID" number`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" ADD "SUBSCRIPTION_ID" number`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" ADD "USER_ID" number`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" ADD "PROFILE_ID" number`);
        await queryRunner.query(`ALTER TABLE "PROFILE" ADD "USER_ID" number`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "userSubscriptionId" number`);
        await queryRunner.query(`ALTER TABLE "WISHLIST" ADD "USER_ID" number`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" ADD "WISHLIST_ID" number`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" ADD "PRODUCT_ID" number`);
        await queryRunner.query(`ALTER TABLE "FAQ_STORE" ADD CONSTRAINT "FK_d19d5e29ba377f8cb75951e192e" FOREIGN KEY ("STORE_ID") REFERENCES "STORE" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" ADD CONSTRAINT "FK_8ac8d07f2e1867648293b5e3d78" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" ADD CONSTRAINT "FK_0166c7c3dda8d8c6c78e6057458" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "CART" ADD CONSTRAINT "FK_1ff986e5ae0523b682ce9f9762d" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "CART" ADD CONSTRAINT "FK_a5ea3ae5f56fe6bcd4fc0ff3fe6" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "CART" ADD CONSTRAINT "FK_573e0686dbf0d27bd1926b96a96" FOREIGN KEY ("PRODUCT_VARIANT_ID") REFERENCES "PRODUCT_VARIANT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" ADD CONSTRAINT "FK_285be5defb148261c63db287c55" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" ADD CONSTRAINT "FK_fd615d67e6008c083453298abc4" FOREIGN KEY ("SUBSCRIPTION_ID") REFERENCES "SUBSCRPTIONS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" ADD CONSTRAINT "FK_335dc9f07b204a44a4dc7fb279c" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" ADD CONSTRAINT "FK_139b63c7998bcfcf82f595d4002" FOREIGN KEY ("PROFILE_ID") REFERENCES "PROFILE" ("ID")`);
        await queryRunner.query(`ALTER TABLE "PROFILE" ADD CONSTRAINT "FK_d1c1771748fe98f564740256ec1" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_b1eb61b206a90c4c49ccca29c36" FOREIGN KEY ("userSubscriptionId") REFERENCES "USER_SUBSCRIPTION" ("ID")`);
        await queryRunner.query(`ALTER TABLE "WISHLIST" ADD CONSTRAINT "FK_bb3955dbb383ab30f3d7d4a8142" FOREIGN KEY ("USER_ID") REFERENCES "USERS" ("ID")`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" ADD CONSTRAINT "FK_0f60bb262a2d344bf2a16d2df3f" FOREIGN KEY ("WISHLIST_ID") REFERENCES "WISHLIST" ("ID")`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" ADD CONSTRAINT "FK_1fd48b5243baffaaf1e0bad712c" FOREIGN KEY ("PRODUCT_ID") REFERENCES "PRODUCT" ("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" DROP CONSTRAINT "FK_1fd48b5243baffaaf1e0bad712c"`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" DROP CONSTRAINT "FK_0f60bb262a2d344bf2a16d2df3f"`);
        await queryRunner.query(`ALTER TABLE "WISHLIST" DROP CONSTRAINT "FK_bb3955dbb383ab30f3d7d4a8142"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_b1eb61b206a90c4c49ccca29c36"`);
        await queryRunner.query(`ALTER TABLE "PROFILE" DROP CONSTRAINT "FK_d1c1771748fe98f564740256ec1"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP CONSTRAINT "FK_139b63c7998bcfcf82f595d4002"`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" DROP CONSTRAINT "FK_335dc9f07b204a44a4dc7fb279c"`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" DROP CONSTRAINT "FK_fd615d67e6008c083453298abc4"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" DROP CONSTRAINT "FK_285be5defb148261c63db287c55"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP CONSTRAINT "FK_573e0686dbf0d27bd1926b96a96"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP CONSTRAINT "FK_a5ea3ae5f56fe6bcd4fc0ff3fe6"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP CONSTRAINT "FK_1ff986e5ae0523b682ce9f9762d"`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" DROP CONSTRAINT "FK_0166c7c3dda8d8c6c78e6057458"`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" DROP CONSTRAINT "FK_8ac8d07f2e1867648293b5e3d78"`);
        await queryRunner.query(`ALTER TABLE "FAQ_STORE" DROP CONSTRAINT "FK_d19d5e29ba377f8cb75951e192e"`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" DROP COLUMN "PRODUCT_ID"`);
        await queryRunner.query(`ALTER TABLE "WISHLIST_ITEM" DROP COLUMN "WISHLIST_ID"`);
        await queryRunner.query(`ALTER TABLE "WISHLIST" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "userSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "PROFILE" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "ADDRESS" DROP COLUMN "PROFILE_ID"`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "USER_SUBSCRIPTION" DROP COLUMN "SUBSCRIPTION_ID"`);
        await queryRunner.query(`ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "PRODUCT_ID"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP COLUMN "PRODUCT_VARIANT_ID"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP COLUMN "PRODUCT_ID"`);
        await queryRunner.query(`ALTER TABLE "CART" DROP COLUMN "USER_ID"`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" DROP COLUMN "PRODUCT_VARIANT_ID"`);
        await queryRunner.query(`ALTER TABLE "ADDON_PRODUCT" DROP COLUMN "PRODUCT_ID"`);
        await queryRunner.query(`ALTER TABLE "FAQ_STORE" DROP COLUMN "STORE_ID"`);
    }

}
