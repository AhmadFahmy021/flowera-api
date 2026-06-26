import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  birth_place?: string;

  @IsDateString()
  @IsOptional()
  birt_date?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  no_hp?: string;
}

export class CreateAddressDto {
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

export class UpdateAddressDto {
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
