import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCostResponse } from 'src/shipping/shipping.service';

// ---------- Checkout Item DTO ----------

export class CheckoutItemDto {
  @IsNumber()
  @IsNotEmpty()
  product_id!: number;

  @IsNumber()
  @IsOptional()
  product_variant_id?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsOptional()
  @Min(100)
  weight_gram?: number;

  @IsString()
  @IsOptional()
  addon_product?: string;

  @IsNumber()
  @IsNotEmpty()
  store_id!: number;

  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @IsString()
  @IsNotEmpty()
  courier_name!: string;
  
  @IsString()
  @IsNotEmpty()
  courier_service!: string;
  
  @IsString()
  @IsNotEmpty()
  shipping_etd!: string;
  
  @IsNumber()
  @IsNotEmpty()
  shipping_cost!: number;
}

// ---------- Checkout DTO ----------

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  order_items!: CheckoutItemDto[];

  @IsNumber()
  @IsNotEmpty()
  address_id!: number;

  @IsString()
  @IsNotEmpty()
  courier!: string;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @ValidateNested({ each: true })
  @Type(() => ShippingSelectionDto)
  shipping!: ShippingSelectionDto[];
}

// ---------- Confirm / Reject Order Image DTO ----------

export class ConfirmImageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['CONFIRMED', 'REJECTED'])
  status!: string;

  @IsString()
  @IsOptional()
  reply_note?: string;
}

// ---------- Checkout Preview DTO (no payment needed) ----------

export class CheckoutPreviewDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  order_items!: CheckoutItemDto[];

  @IsNumber()
  @IsNotEmpty()
  address_id!: number;

  @IsString()
  @IsNotEmpty()
  courier!: string;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @ValidateNested({ each: true })
  @Type(() => ShippingSelectionDto)
  shipping!: ShippingSelectionDto[];
}

export class ShippingOptionDto {
    address_id!: number;

    order_items!: CheckoutItemDto[];
}

export class ShippingSelectionDto {

  @IsNumber()
  store_id!: number;

  @IsString()
  courier_name!: string;

  @IsString()
  courier_service!: string;

  @IsString()
  courier_code!: string;

  @IsNumber()
  shipping_cost!: number;

  @IsString()
  shipping_etd!: string;
}

export class ShippingOptionStoreDto {
    store_id!: number;
    weight!: number;
    shipping!: ShippingCostResponse[];
}