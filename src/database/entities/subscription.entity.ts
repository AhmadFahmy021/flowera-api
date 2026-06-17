import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity({ name: 'SUBSCRPTIONS' })
export class Subscriptions {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'TITLE', length: 150 })
  title!: string;

  @Column({ name: 'DESCRIPTION', type: 'clob' })
  description!: string;

  @Column({ name: 'IS_SHOW', type: 'number', width: 1, default: 1 })
  isShow!: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscription_id,
  )
  user_subscription?: UserSubscription;
}
