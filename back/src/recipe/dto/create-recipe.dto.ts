import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';

export class IngredientRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  ingredientCount: number;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cost: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  energy: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  createTime: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  itemCode: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  createBundle: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'lostark icon url' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ type: [IngredientRecipeDto] })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => IngredientRecipeDto)
  @ValidateNested({ each: true })
  ingredient: IngredientRecipeDto[];
}
