import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';

@Entity({ name: 'SELLER' })
export class Seller {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToOne(() => User, (user) => user.seller)
  @JoinColumn({ name: 'USER_ID' })
  user!: User;

  @OneToOne(() => Store, (store) => store.seller)
  store!: Store;
}
