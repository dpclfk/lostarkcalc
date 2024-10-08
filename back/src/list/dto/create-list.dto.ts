import { ApiProperty } from '@nestjs/swagger';

export class ListDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  currentMinPrice: number;

  @ApiProperty()
  ingredientAllCost: number;

  @ApiProperty()
  createCost: number;

  @ApiProperty()
  energy: number;

  @ApiProperty()
  createBundle: number;

  @ApiProperty()
  marketBundle: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  icon: string;
}
