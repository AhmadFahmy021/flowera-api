import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubProductCategories } from './sub-product_categories.entity';

@Entity({ name: 'PRODUCT_CATEGORIES' })
export class ProducCategories {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'TITLE', length: 150 })
  title!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => SubProductCategories, (subProductCategories) => subProductCategories.product_categories)
  sub_product_categories!: SubProductCategories;
}
