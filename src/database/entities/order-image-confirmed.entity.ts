import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity({ name: 'ORDER_IMAGE_CONFIRMED' })
export class OrderImageConfirmed {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => User, (user) => user.order_image_confirmed)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: number;

  @OneToOne(() => Order, (order) => order.order_image_confirmed)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'IMAGE_URL', type: 'varchar2', length: 255 })
  image_url!: string;

  @Column({ name: 'NOTE', type: 'varchar2', length: 160 })
  note!: string;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
