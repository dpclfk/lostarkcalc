import { ApiProperty } from '@nestjs/swagger';

export class CreateResRecipeDto {
  @ApiProperty()
  itemId: number;
}
