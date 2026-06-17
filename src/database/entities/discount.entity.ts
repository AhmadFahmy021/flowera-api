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
import { Store } from './store.entity';
import { Product } from './product.entity';
import { DiscountUsage } from './discount-usage.entity';

@Entity({ name: 'DISCOUNT' })
export class Discount {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => Store, (store) => store.discount, { nullable: true })
  @JoinColumn({ name: 'STORE_ID' })
  store_id!: number;

  @OneToOne(() => Product, (product) => product.discount, { nullable: true })
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;
  // @OneToOne(() => User, (user) => user.order)
  // @JoinColumn({name: "USER_ID"})
  // user_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 150 })
  title!: string;

  @Column({ name: 'TOTAL_DISKON', type: 'number' })
  totalDiskon!: number;

  @Column({ name: 'DESCRIPTION', type: 'clob' })
  description!: number;

  @Column({ name: 'EXPIRED', type: 'date' })
  expired!: Date;

  @Column({ name: 'IS_FOR_SUBSCRIPTION', type: 'number', width: 1, default: 0 })
  isForSubscription!: boolean;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToOne(() => DiscountUsage, (discountUsage) => discountUsage.discount_id)
  discount_usage!: DiscountUsage;
}
