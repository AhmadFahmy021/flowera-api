import { PartialType } from "@nestjs/mapped-types";
import {
  IsDateString,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class ProfileCreateDto {

  @IsString()
  @IsNotEmpty()
  birth_place!: string;

  @IsDateString()
  @IsNotEmpty()
  birth_date!: Date;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsString()
  @IsNotEmpty()
  no_hp!: string;

}

export class ProfileUpdateDto extends PartialType(ProfileCreateDto) {}