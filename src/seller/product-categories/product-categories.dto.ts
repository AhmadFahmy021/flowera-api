import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductCategoriesCreateDto{
    @IsString()
    @IsNotEmpty()
    title!: string;
}

export class ProductCategoriesUpdateDto extends PartialType(ProductCategoriesCreateDto){

}