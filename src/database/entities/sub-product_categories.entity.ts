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
import { ProducCategories } from './prouct-categories.entity';
import { Product } from './product.entity';

@Entity({ name: 'SUB_PRODUCT_CATEGORIES' })
export class SubProductCategories {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => ProducCategories, (productCategories) => productCategories.sub_product_categories)
  @JoinColumn({ name: 'PRODUCT_CATEGORIES_ID' })
  product_categories!: ProducCategories;

  @Column({ name: 'TITLE', length: 150 })
  title!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => Product, (product) => product.sub_product_categories)
  product!: Product;
}
