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
import { Product } from './product.entity';
import { Order } from './order.entity';
import { ReviewImage } from './review-image.entity';

@Entity({ name: 'REVIEW' })
export class Review {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: number;

  @OneToOne(() => Product, (product) => product.review, { nullable: true })
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;

  @OneToOne(() => Order, (order) => order.review, { nullable: true })
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: number;

  // @OneToOne(() => User, (user) => user.order)
  // @JoinColumn({name: "USER_ID"})
  // user_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'RATING', type: 'number' })
  rating!: number;

  @Column({ name: 'COMMENT', type: 'clob' })
  comment!: number;

  @Column({ name: 'IS_ANONYMOUS', type: 'number', width: 1, default: 0 })
  isAnonymous!: boolean;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToOne(() => ReviewImage, (reviewImage) => reviewImage.review_id)
  review_image!: ReviewImage;
}
