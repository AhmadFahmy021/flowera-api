import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'CART' })
export class Cart {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: number;

  @ManyToOne(() => Product, (product) => product.cart)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product_id!: number;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.cart, {
    nullable: true,
  })
  @JoinColumn({ name: 'PRODUCT_VARIANT_ID' })
  product_variant_id!: number;

  @Column({ name: 'QUANTITY', type: 'number' })
  quantity!: number;

  @Column({ name: 'PRICE', type: 'number' })
  price!: number;

  @Column({ name: 'SUB_TOTAL', type: 'number' })
  subTotal!: number;

  @Column({ name: 'ADDON_PRODUCT', type: 'clob' })
  addon_product!: string;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
