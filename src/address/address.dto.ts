import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddressCreateDto {
  @IsString()
  @IsNotEmpty()
  nama_penerima!: string;

  @IsString()
  @IsNotEmpty()
  no_hp!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class AddressUpdateDto {
  @IsString()
  @IsOptional()
  nama_penerima?: string;

  @IsString()
  @IsOptional()
  no_hp?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  note?: string;
}