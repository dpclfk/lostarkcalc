import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  energy: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  createTime: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  itemCode: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  createBundle: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsArray({ each: true })
  @ArrayNotEmpty()
  ingredient: {
    itemName: string;
    ingredientCount: number;
  }[];
}
