import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class IngredientListDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  currentMinPrice: number;

  @ApiProperty()
  ingredientCount: number;

  @ApiProperty()
  bundle: number;

  @ApiProperty()
  icon: string;
}

export class DetailItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  currentMinPrice: number;

  @ApiProperty()
  createCost: number;

  @ApiProperty()
  energy: number;

  @ApiProperty()
  createTime: number;

  @ApiProperty()
  createBundle: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  marketBundle: number;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  itemCode: number;

  @ApiProperty({ type: [IngredientListDto] })
  @Type(() => IngredientListDto)
  @ValidateNested({ each: true })
  ingredient: IngredientListDto[];
}
