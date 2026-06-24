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
import { AddonProduct } from './addon-product.entity';
import { ProductImage } from './product-image.entity';
import { Cart } from './cart.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';

@Entity({ name: 'PRODUCT_VARIANT' })
export class ProductVariant {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => Product, (product) => product.product_variant)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product!: Product;

  @Column({ name: 'TITLE', length: 150, type: 'varchar2' })
  title!: string;

  @Column({ name: 'SUB_TITLE', length: 150, type: 'varchar2' })
  subTitle!: string;

  @Column({ name: 'PRICE', type: 'number' })
  price!: number;

  

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => AddonProduct, (addonProduct) => addonProduct.product)
  addon_product!: AddonProduct;

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product_variant,
  )
  product_image!: ProductImage;

  @OneToMany(() => Cart, (cart) => cart.user_id)
  cart!: number;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.product_variant_id)
  order_item!: Order;
}
