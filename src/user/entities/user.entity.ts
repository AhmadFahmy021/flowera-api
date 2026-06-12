import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'NAME', length: 100 })
  name!: string;

  @Column({ name: 'USERNAME', length: 100, unique: true })
  username!: string;

  @Column({ name: 'EMAIL', length: 150, unique: true })
  email!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @CreateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @CreateDateColumn({ name: 'DELETED_AT' })
  deletedAt!: Date;
}