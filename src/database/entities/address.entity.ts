import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Profile } from './profile.entity';

@Entity({ name: 'ADDRESS' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @ManyToOne(() => Profile, (profile) => profile.address)
  @JoinColumn({ name: 'PROFILE_ID' })
  profile_id!: Profile;

  @Column({ name: 'NAMA_PENERIMA', type: 'varchar2', length: 150 })
  nama_penerima!: string;

  @Column({ name: 'NO_HP', length: 50 })
  no_hp!: string;

  @Column({ name: 'ADDRESS', type: 'clob' })
  address!: string;

  @Column({ name: 'NOTE', type: 'clob', nullable: true })
  note?: string;

  // Regional fields (compatible with RajaOngkir / api-regional-indonesia)
  @Column({ name: 'PROVINCE_NAME', type: 'varchar2', length: 200, nullable: true })
  province_name?: string;

  @Column({ name: 'CITY_NAME', type: 'varchar2', length: 200, nullable: true })
  city_name?: string;

  @Column({ name: 'DISTRICT_NAME', type: 'varchar2', length: 200, nullable: true })
  district_name?: string;

  @Column({ name: 'SUBDISTRICT_NAME', type: 'varchar2', length: 200, nullable: true })
  subdistrict_name?: string;

  @Column({ name: 'ZIP_CODE', type: 'varchar2', length: 10, nullable: true })
  zip_code?: string;

  @Column({ name: 'SUBDISTRICT_ID', type: 'varchar2', length: 20, nullable: true })
  subdistrict_id?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
