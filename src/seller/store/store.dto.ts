import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class StoreCreateDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

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

export class StoreUpdateDto extends PartialType(StoreCreateDto) {}