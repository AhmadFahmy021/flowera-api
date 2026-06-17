import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { AddonProduct } from './addon-product.entity';

@Entity({ name: 'PRODUCT_IMAGE' })
export class ProductImage {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => Product, (product) => product.product_image, {
    nullable: true,
  })
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;

  @OneToOne(
    () => ProductVariant,
    (productVariant) => productVariant.product_image,
    { nullable: true },
  )
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant_id!: number;

  @OneToOne(() => AddonProduct, (addonProduct) => addonProduct.product_image, {
    nullable: true,
  })
  @JoinColumn({ name: 'ADDON_PRODUCT_ID' })
  addon_product_id!: number;

  @Column({ name: 'IMAGE_URL', type: 'varchar2', length: 255 })
  image_url!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
