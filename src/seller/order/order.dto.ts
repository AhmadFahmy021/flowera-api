import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'CONFIRM_SELLER',
    'PROSES_PENGERJAAN',
    'CONFIRM_USER',
    'DELIVERY',
    'DITERIMA',
  ])
  status!: string;

  @IsString()
  @IsOptional()
  receiptNumber?: string;
}
