import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';
import { OrderImageConfirmed } from './order-image-confirmed.entity';

@Entity({ name: 'ORDER_ITEM' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'QUANTITY', type: 'int' })
  quantity!: number;

  @Column({ name: 'PRICE', type: 'int', nullable: true })
  price?: number;

  @Column({ name: 'SUB_TOTAL', type: 'int', nullable: true })
  subTotal?: number;

  @Column({ name: 'DISCOUNT', type: 'int' })
  discount!: number;

  // Shipping / expedisi fields (per item, per store)
  @Column({ name: 'COURIER_NAME', type: 'varchar', length: 100, nullable: true })
  courier_name?: string;

  @Column({ name: 'COURIER_SERVICE', type: 'varchar', length: 100, nullable: true })
  courier_service?: string;

  @Column({ name: 'SHIPPING_COST', type: 'int', nullable: true })
  shipping_cost?: number;

  @Column({ name: 'SHIPPING_ETD', type: 'varchar', length: 50, nullable: true })
  shipping_etd?: string;

  @ManyToOne(() => Product, (product) => product.order_item)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: Product;

  @Column({ name: 'ADDON_PRODUCT', type: 'text', nullable: true })
  addon_product?: string;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.order_item, { nullable: true })
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant_id?: ProductVariant;

  @ManyToOne(() => Order, (order) => order.order_item)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: Order;

  @ManyToOne(() => Store, (store) => store.order_item)
  @JoinColumn({ name: 'STORE_ID' })
  store_id!: Store;

  @Column({ name: 'STATUS', type: 'varchar', length: 100, default: 'PENDING' })
  status!: string;

  @OneToMany(() => OrderImageConfirmed, (order_image_confirmed) => order_image_confirmed.order_id)
  order_image_confirmed!: OrderImageConfirmed[];

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
