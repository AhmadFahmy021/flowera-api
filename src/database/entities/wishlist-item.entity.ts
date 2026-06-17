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
import { Wishlist } from './wishlist.entity';
import { Product } from './product.entity';

@Entity({ name: 'WISHLIST_ITEM' })
export class WishlistItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.wishlist_item)
  @JoinColumn({ name: 'WISHLIST_ID' })
  wishlist_id!: number;

  @OneToMany(() => Product, (product) => product.wishlist_item)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
