import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminCreateSellerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  store_name?: string;

  @IsString()
  @IsOptional()
  store_address?: string;

  @IsString()
  @IsOptional()
  store_type?: string;

  @IsString()
  @IsOptional()
  store_description?: string;

  @IsString()
  @IsOptional()
  city?: string;

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

export class AdminUpdateSellerDto extends PartialType(AdminCreateSellerDto) {}
