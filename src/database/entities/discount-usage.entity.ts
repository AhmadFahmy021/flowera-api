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
import { Discount } from './discount.entity';

@Entity({ name: 'DISCOUNT_USAGE' })
export class DiscountUsage {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({ name: 'USER_ID' })
  user_id?: number;

  @OneToOne(() => Discount, (discount) => discount.discount_usage, {
    nullable: true,
  })
  @JoinColumn({ name: 'DISCOUNT_ID' })
  discount_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
