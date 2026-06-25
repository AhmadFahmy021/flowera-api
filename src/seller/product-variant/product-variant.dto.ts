import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductVariantCreateDto{
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    sub_title!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsNotEmpty()
    product_id!: number;
}

export class ProductVariantUpdateDto extends ProductVariantCreateDto{}