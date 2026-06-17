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
import { User } from './user.entity';
import { OrderImageConfirmed } from './order-image-confirmed.entity';
import { OrderItem } from './order-item.entity';
import { PaymentOrder } from './payment-order.entity';
import { DiscountUsage } from './discount-usage.entity';
import { Review } from './review.entity';

@Entity({ name: 'ORDER' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToMany(() => User, (user) => user.order)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: number;

  @Column({ name: 'ORDER_NUMBER', type: 'varchar2', length: 150 })
  orderNumber!: string;

  @Column({ name: 'STATUS', type: 'varchar2', length: 100 })
  status!: string;

  @Column({ name: 'TOTAL', type: 'number' })
  total!: number;

  @Column({ name: 'IS_CUSTOMER_CONFIRMED', type: 'varchar2', length: 150 })
  isCustomerConfirmed!: string;

  @Column({ name: 'DISCOUNT', type: 'number' })
  discount!: string;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToOne(
    () => OrderImageConfirmed,
    (orderImageConfirmed) => orderImageConfirmed.order_id,
  )
  order_image_confirmed!: OrderImageConfirmed;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.order_id)
  order_item!: OrderItem;

  @OneToOne(() => PaymentOrder, (paymentOrder) => paymentOrder.order_id)
  payment_order!: OrderItem;

  @OneToOne(() => Review, (review) => review.order_id)
  review!: Review;
}
