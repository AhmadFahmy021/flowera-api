import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SubProductCategoriesCreateDto{
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsNumber()
    @IsNotEmpty()
    sub_product_categories_id!: number;
}

export class SubProductCategoriesUpdateDto extends PartialType(SubProductCategoriesCreateDto){}