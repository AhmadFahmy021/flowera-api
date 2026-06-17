import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Admin } from './admin.entity';
import { Seller } from './seller.entity';
import { UserSubscription } from './user-subscription.entity';
import { Profile } from './profile.entity';
import { Wishlist } from './wishlist.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { OrderImageConfirmed } from './order-image-confirmed.entity';
import { Review } from './review.entity';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'NAME', length: 100 })
  name!: string;

  @Column({ name: 'USERNAME', length: 100, unique: true })
  username!: string;

  @Column({ name: 'EMAIL', length: 255, unique: true })
  email!: string;

  @Column({ name: 'PASSWORD', length: 255, nullable: true })
  password?: string;

  // Untuk OAuth — user bisa tidak punya password
  @Column({ name: 'GOOGLE_ID', length: 255, nullable: true })
  googleId?: string;

  @Column({ name: 'AVATAR', length: 500, nullable: true })
  avatar?: string;

  // Refresh token disimpan di DB (hashed)
  @Column({ name: 'REFRESH_TOKEN', type: 'clob', nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin?: Admin;

  @OneToOne(() => Seller, (seller) => seller.user)
  seller?: Seller;

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.user_id,
  )
  user_subscription?: UserSubscription;

  @OneToMany(() => Profile, (profile) => profile.user_id)
  profile!: number;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user_id)
  wishlist!: number;

  @OneToMany(() => Cart, (cart) => cart.user_id)
  cart!: number;

  @OneToMany(() => Order, (order) => order.user_id)
  order!: number;

  @OneToOne(
    () => OrderImageConfirmed,
    (orderImageConfirmed) => orderImageConfirmed.user_id,
  )
  order_image_confirmed!: OrderImageConfirmed;

  @OneToOne(() => Review, (review) => review.user_id)
  review!: Review;
}
