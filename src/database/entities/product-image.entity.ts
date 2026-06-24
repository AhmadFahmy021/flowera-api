import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => Product, (product) => product.product_image, {
    nullable: true,
  })
  @JoinColumn({ name: 'PRODUCT_ID' })
  product!: Product;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.product_image,
    { nullable: true },
  )
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant!: ProductVariant;

  @ManyToOne(() => AddonProduct, (addonProduct) => addonProduct.product_image, {
    nullable: true,
  })
  @JoinColumn({ name: 'ADDON_PRODUCT_ID' })
  addon_product!: AddonProduct;

  @Column({ name: 'IMAGE_URL', type: 'varchar2', length: 255 })
  image_url!: string;

  @Column({ name: 'IS_DEFAULT', type: 'number', width: 1, default: 0 })
  isDefault!: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
