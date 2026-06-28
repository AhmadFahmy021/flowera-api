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
import { User } from './user.entity';
import { OrderImageConfirmed } from './order-image-confirmed.entity';
import { OrderItem } from './order-item.entity';
import { PaymentOrder } from './payment-order.entity';
import { Review } from './review.entity';

@Entity({ name: 'ORDER' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: User;

  @Column({ name: 'ORDER_NUMBER', type: 'varchar2', length: 150 })
  orderNumber!: string;

  @Column({ name: 'STATUS', type: 'varchar2', length: 100 })
  status!: string;

  @Column({ name: 'TOTAL', type: 'number' })
  total!: number;

  @Column({ name: 'DISCOUNT', type: 'number' })
  discount!: number;

  @Column({ name: 'ITEMS_TOTAL', type: 'number', nullable: true })
  items_total?: number;

  @Column({ name: 'SHIPPING_TOTAL', type: 'number', nullable: true })
  shipping_total?: number;

  @Column({ name: 'IS_CUSTOMER_CONFIRMED', type: 'varchar2', length: 150, nullable: true })
  isCustomerConfirmed?: string;

  @Column({ name: 'NOTE', type: 'clob', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => OrderImageConfirmed, (oic) => oic.order_id)
  order_image_confirmed!: OrderImageConfirmed[];

  @OneToMany(() => OrderItem, (oi) => oi.order_id)
  order_item!: OrderItem[];

  @OneToOne(() => PaymentOrder, (po) => po.order_id)
  payment_order!: PaymentOrder;

  @OneToOne(() => Review, (r) => r.order_id)
  review!: Review;
}
