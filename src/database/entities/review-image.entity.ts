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
import { Review } from './review.entity';

@Entity({ name: 'REVIEW_IMAGE' })
export class ReviewImage {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @OneToOne(() => Review, (review) => review.review_image)
  @JoinColumn({ name: 'REVIEW_ID' })
  review_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  @Column({ name: 'IMAGE_URL' })
  image_url!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
