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
import { Store } from './store.entity';

@Entity({ name: 'FAQ_STORE' })
export class FaqStore {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => Store, (store) => store.faq_store)
  @JoinColumn({ name: 'STORE_ID' })
  store!: Store;

  @Column({ name: 'TITLE', length: 150, type: 'varchar2' })
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
}
