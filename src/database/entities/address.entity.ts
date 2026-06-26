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
import { Profile } from './profile.entity';

@Entity({ name: 'ADDRESS' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: string;

  @ManyToOne(() => Profile, (profile) => profile.address)
  @JoinColumn({ name: 'PROFILE_ID' })
  profile_id!: string;

  @Column({ name: 'NAMA_PENERIMA', type: 'varchar2', length: 150 })
  nama_penerima!: string;

  @Column({ name: 'NO_HP', length: 50 })
  no_hp!: string;

  @Column({ name: 'ADDRESS', type: 'clob' })
  address!: string;

  @Column({ name: 'NOTE', type: 'clob', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
