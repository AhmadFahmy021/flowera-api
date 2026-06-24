import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'ADDON_PRODUCT' })
export class AddonProduct {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 150 })
  title!: number;

  @Column({ name: 'PRICE', type: 'number' })
  price!: number;

  @ManyToOne(() => Product, (product) => product.addon_product)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product!: Product;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.addon_product,
    { nullable: true },
  )
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant!: ProductVariant;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => ProductImage, (productImage) => productImage.addon_product)
  product_image!: ProductImage;
}
