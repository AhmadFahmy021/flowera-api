import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WishlistItem } from './wishlist-item.entity';

@Entity({ name: 'WISHLIST' })
export class Wishlist {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToMany(() => User, (user) => user.wishlist)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: User;

  @Column({ name: 'NAME', type: 'varchar2', length: 150 })
  name!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist_id)
  wishlist_item!: WishlistItem;
}
