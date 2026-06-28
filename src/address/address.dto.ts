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

  // Regional fields
  @IsString()
  @IsOptional()
  province_name?: string;

  @IsString()
  @IsOptional()
  city_name?: string;

  @IsString()
  @IsOptional()
  district_name?: string;

  @IsString()
  @IsOptional()
  subdistrict_name?: string;

  @IsString()
  @IsOptional()
  zip_code?: string;

  @IsString()
  @IsOptional()
  subdistrict_id?: string;
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

  @IsString()
  @IsOptional()
  province_name?: string;

  @IsString()
  @IsOptional()
  city_name?: string;

  @IsString()
  @IsOptional()
  district_name?: string;

  @IsString()
  @IsOptional()
  subdistrict_name?: string;

  @IsString()
  @IsOptional()
  zip_code?: string;

  @IsString()
  @IsOptional()
  subdistrict_id?: string;
}