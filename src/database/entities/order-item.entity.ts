import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';

@Entity({ name: 'ORDER_ITEM' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'QUANTITY', type: 'number' })
  quantity!: number;

  @Column({ name: 'PRICE', type: 'number', nullable: true })
  price?: number;

  @Column({ name: 'SUB_TOTAL', type: 'number', nullable: true })
  subTotal?: number;

  @Column({ name: 'DISCOUNT', type: 'number' })
  discount!: number;

  // Shipping / expedisi fields (per item, per store)
  @Column({ name: 'COURIER_NAME', type: 'varchar2', length: 100, nullable: true })
  courier_name?: string;

  @Column({ name: 'COURIER_SERVICE', type: 'varchar2', length: 100, nullable: true })
  courier_service?: string;

  @Column({ name: 'SHIPPING_COST', type: 'number', nullable: true })
  shipping_cost?: number;

  @Column({ name: 'SHIPPING_ETD', type: 'varchar2', length: 50, nullable: true })
  shipping_etd?: string;

  @ManyToOne(() => Product, (product) => product.order_item)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: Product;

  @Column({ name: 'ADDON_PRODUCT', type: 'clob', nullable: true })
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

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
