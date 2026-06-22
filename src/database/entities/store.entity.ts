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
import { Seller } from './seller.entity';
import { FaqStore } from './faq-store.entity';
import { OrderItem } from './order-item.entity';
import { Discount } from './discount.entity';
import { Product } from './product.entity';

@Entity({ name: 'STORE' })
export class Store {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 150 })
  name!: string;

  @Column({ name: 'SLUG', type: 'varchar2', length: 255 })
  slug!: string;

  @Column({ name: 'LOGO', type: 'varchar2', length: 255, nullable: true})
  logo?: string;

  @OneToOne(() => Seller, (seller) => seller.store)
  @JoinColumn({ name: 'SELLER_ID' })
  seller_id!: number;

  @Column({ name: 'ADDRESS', type: 'clob' })
  address!: string;

  @Column({ name: 'TYPE', type: 'varchar2', length: 150 })
  type!: string;

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

  @Column({ name: 'CITY', type: 'varchar2', length: 200 })
  city!: string;

  @Column({ name: 'DATEONLINELAST', type: 'date', nullable: true })
  dateOnlineLast!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => FaqStore, (faqStore) => faqStore.store_id)
  faq_store!: number;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.store_id)
  order_item!: OrderItem;

  @OneToOne(() => Discount, (discount) => discount.store_id)
  discount!: OrderItem;
  
  @OneToMany(
    () => Product,
    (product) => product.store_id,
  )
  products!: Product[];
}
