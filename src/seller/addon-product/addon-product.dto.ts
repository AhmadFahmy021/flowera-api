import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddOnProductCreateDto{
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsOptional()
    product_id?: number;

    @IsNumber()
    @IsOptional()
    product_variant_id?: number;
}

export class AddProductUpdateDto extends PartialType(AddOnProductCreateDto){}