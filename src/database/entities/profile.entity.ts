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
import { Address } from './address.entity';

@Entity({ name: 'PROFILE' })
export class Profile {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'USER_ID' })
  user_id!: User;

  @Column({ name: 'BIRTH_PLACE', type: 'varchar2' })
  birth_place!: string;

  @Column({ name: 'BIRTH_DATE', type: 'date' })
  birth_date!: Date;

  @Column({ name: 'GENDER', type: 'varchar2', length: 50 })
  gender!: string;

  @Column({ name: 'NO_HP', type: 'varchar2', length: 50 })
  no_hp!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;

  @OneToMany(() => Address, (address) => address.profile_id)
  address!: Address;
}
