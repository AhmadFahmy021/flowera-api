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
import { Order } from './order.entity';

@Entity({ name: 'PAYMENT_ORDER' })
export class PaymentOrder {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => Order, (order) => order.payment_order)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: number;

  // @OneToOne(() => User, (user) => user.order)
  // @JoinColumn({name: "USER_ID"})
  // user_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'PAYMENT_METHOD', type: 'varchar2', length: 200 })
  payment_method!: string;

  @Column({ name: 'TOTAL_PRICE', type: 'number' })
  total_price!: string;

  @Column({ name: 'EXPIRED_PAYMENT_TIME', type: 'date' })
  expired_payment_time!: Date;

  @Column({ name: 'PAYMENT_TIME', type: 'date' })
  payment_time!: Date;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
