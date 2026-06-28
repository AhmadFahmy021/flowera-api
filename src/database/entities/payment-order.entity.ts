// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinColumn,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Order } from './order.entity';

// @Entity({ name: 'PAYMENT_ORDER' })
// export class PaymentOrder {
//   @PrimaryGeneratedColumn({ name: 'ID' })
//   id!: number;

//   @OneToOne(() => Order, (order) => order.payment_order)
//   @JoinColumn({ name: 'ORDER_ID' })
//   order_id!: number;

//   // @OneToOne(() => User, (user) => user.order)
//   // @JoinColumn({name: "USER_ID"})
//   // user_id!: number;

//   //@OneToMany(() => User, (user) => user.order)
//   //@JoinColumn({name: "USER_ID"})
//   //user_id!: number;

//   @Column({ name: 'PAYMENT_METHOD', type: 'varchar2', length: 200 })
//   payment_method!: string;

//   @Column({ name: 'TOTAL_PRICE', type: 'number' })
//   total_price!: string;

//   @Column({ name: 'EXPIRED_PAYMENT_TIME', type: 'date' })
//   expired_payment_time!: Date;

//   @Column({ name: 'PAYMENT_TIME', type: 'date', nullable: true })
//   payment_time?: Date;

//   // @Column({ name: 'nameTable' })
//   // nameTable!: Date;

//   @CreateDateColumn({ name: 'CREATED_AT' })
//   createdAt!: Date;

//   @UpdateDateColumn({ name: 'UPDATED_AT' })
//   updatedAt!: Date;

//   @DeleteDateColumn({ name: 'DELETED_AT' })
//   deletedAt?: Date | null;
// }

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
import { Order } from './order.entity';

@Entity({ name: 'PAYMENT_ORDER' })
export class PaymentOrder {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  // Relasi Order
  @OneToOne(() => Order, (order) => order.payment_order)
  @JoinColumn({ name: 'ORDER_ID' })
  order_id!: Order;

  // MIDTRANS / XENDIT / TRIPAY
  @Column({
    name: 'PAYMENT_GATEWAY',
    type: 'varchar2',
    length: 50,
    default: 'MIDTRANS',
  })
  payment_gateway!: string;

  // SNAP / QRIS / VA / GOPAY / SHOPEEPAY
  @Column({
    name: 'PAYMENT_METHOD',
    type: 'varchar2',
    length: 100,
  })
  payment_method!: string;

  // QRIS / BCA_VA / BNI_VA / GOPAY dll
  @Column({
    name: 'PAYMENT_CHANNEL',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  payment_channel?: string;

  // Pending / Paid / Failed / Expired / Cancelled
  @Column({
    name: 'STATUS',
    type: 'varchar2',
    length: 50,
    default: 'PENDING',
  })
  status!: string;

  // Total yang harus dibayar
  @Column({
    name: 'TOTAL_PRICE',
    type: 'number',
  })
  total_price!: number;

  // Order ID Merchant (ORDER-20260628-0001)
  @Column({
    name: 'REFERENCE_ID',
    type: 'varchar2',
    length: 150,
    unique: true,
  })
  reference_id!: string;

  // Transaction ID dari Midtrans
  @Column({
    name: 'TRANSACTION_ID',
    type: 'varchar2',
    length: 150,
    nullable: true,
  })
  transaction_id?: string;

  // Snap Token
  @Column({
    name: 'SNAP_TOKEN',
    type: 'varchar2',
    length: 300,
    nullable: true,
  })
  snap_token?: string;

  // Redirect URL Midtrans
  @Column({
    name: 'PAYMENT_URL',
    type: 'clob',
    nullable: true,
  })
  payment_url?: string;

  // QR String (khusus QRIS)
  @Column({
    name: 'QR_STRING',
    type: 'clob',
    nullable: true,
  })
  qr_string?: string;

  // Nomor VA
  @Column({
    name: 'VA_NUMBER',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  va_number?: string;

  // Nama Bank VA
  @Column({
    name: 'BANK',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  bank?: string;

  // Waktu kadaluarsa pembayaran
  @Column({
    name: 'EXPIRED_PAYMENT_TIME',
    type: 'timestamp',
    nullable: true,
  })
  expired_payment_time?: Date;

  // Waktu pembayaran berhasil
  @Column({
    name: 'PAYMENT_TIME',
    type: 'timestamp',
    nullable: true,
  })
  payment_time?: Date;

  // Response lengkap dari Midtrans
  @Column({
    name: 'PAYMENT_RESPONSE',
    type: 'clob',
    nullable: true,
  })
  payment_response?: string;

  @CreateDateColumn({
    name: 'CREATED_AT',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'DELETED_AT',
  })
  deletedAt?: Date | null;
}