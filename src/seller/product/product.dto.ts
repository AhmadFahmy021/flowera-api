import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductCreateDto{
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsNotEmpty()
    isLifeFlower!: boolean;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsNotEmpty()
    sub_product_categories_id!: number;
}

export class ProductUpdateDto extends PartialType(ProductCreateDto){}

export class UploadProductImageDto {
    defaultIndex?: number;
}
