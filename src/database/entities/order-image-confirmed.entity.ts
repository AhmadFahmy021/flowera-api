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
import { User } from './user.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'ORDER_IMAGE_CONFIRMED' })
export class OrderImageConfirmed {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => User, (user) => user.order_image_confirmed)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: User;

  @ManyToOne(() => Order, (order) => order.order_image_confirmed)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: Order;

  @ManyToOne(() => OrderItem, (order_item) => order_item.order_image_confirmed, {nullable: true})
  @JoinColumn({ name: 'ORDER_ITEM_ID' })
  order_item!: OrderItem;

  @Column({ name: 'IMAGE_URL', type: 'varchar', length: 255 })
  image_url!: string;

  @Column({ name: 'NOTE', type: 'varchar', length: 500, nullable: true })
  note?: string;

  @Column({ name: 'REPLY_NOTE', type: 'varchar', length: 500, nullable: true })
  reply_note?: string;

  @Column({ name: 'STATUS', type: 'varchar', length: 50, default: 'PENDING' })
  status!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
