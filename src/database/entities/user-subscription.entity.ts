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
import { Subscriptions } from './subscription.entity';

@Entity({ name: 'USER_SUBSCRIPTION' })
export class UserSubscription {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.user_subscription,
  )
  @JoinColumn({ name: 'SUBSCRIPTION_ID' })
  subscription_id!: Subscriptions;

  @ManyToOne(() => User, (user) => user.user_subscription)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: User;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
