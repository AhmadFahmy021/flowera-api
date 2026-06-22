import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubProductCategories } from './sub-product_categories.entity';
import { ProductVariant } from './product-variant.entity';
import { AddonProduct } from './addon-product.entity';
import { ProductImage } from './product-image.entity';
import { WishlistItem } from './wishlist-item.entity';
import { Cart } from './cart.entity';
import { OrderItem } from './order-item.entity';
import { Discount } from './discount.entity';
import { Review } from './review.entity';

@Entity({ name: 'PRODUCT' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 150 })
  name!: string;

  @Column({ name: 'SLUG', type: 'varchar2', length: 255 })
  slug!: string;

  @Column({ name: 'DESCRIPTION', type: 'clob' })
  description!: string;

  @Column({
    name: 'RATING',
    type: 'decimal',
    precision: 1,
    scale: 1,
    nullable: true,
    default: 0.0,
  })
  rating?: number;

  @OneToMany(
    () => SubProductCategories,
    (subProductCategories) => subProductCategories.product,
  )
  @JoinColumn({ name: 'SUB_PRODUCT_CATEGORIES_ID' })
  sub_product_categories_id!: number;

  @Column({ name: 'IS_LIFE_FLOWER', type: 'number', width: 1, default: 1 })
  isLifeFlower!: boolean;

  @Column({ name: 'PRICE', type: 'number' })
  price!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(
    () => ProductVariant,
    (productVariant) => productVariant.product_id,
  )
  product_variant!: ProductVariant;

  @OneToMany(() => AddonProduct, (addonProduct) => addonProduct.product_id)
  addon_product!: AddonProduct;

  @OneToOne(() => ProductImage, (productImage) => productImage.product_id)
  product_image!: ProductImage;

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist_id)
  wishlist_item!: WishlistItem;

  @OneToMany(() => Cart, (cart) => cart.user_id)
  cart!: number;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.product_id)
  order_item!: OrderItem;

  @OneToOne(() => Discount, (discount) => discount.product_id)
  discount!: OrderItem;

  @OneToOne(() => Review, (review) => review.product_id)
  review!: Review;
}
