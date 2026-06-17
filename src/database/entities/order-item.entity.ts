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
import { ProductVariant } from './product-variant.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';

@Entity({ name: 'ORDER_ITEM' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  // @OneToOne(() => User, (user) => user.order)
  // @JoinColumn({name: "USER_ID"})
  // user_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'QUANTITY', type: 'number' })
  quantity!: number;

  @Column({ name: 'DISSCOUNT', type: 'number' })
  disscount!: number;

  @OneToOne(() => Product, (product) => product.order_item)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;

  @Column({ name: 'ADDON_PRODUCT', type: 'clob' })
  addon_product!: string;

  @OneToOne(() => ProductVariant, (productVariant) => productVariant.order_item)
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant_id!: number;

  @OneToOne(() => Order, (order) => order.order_item)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: number;

  @OneToOne(() => Store, (store) => store.order_item)
  @JoinColumn({ name: 'STORE_ID' })
  store_id!: number;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
