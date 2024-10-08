import { ApiProperty } from '@nestjs/swagger';

export class CreateResDto {
  @ApiProperty()
  name: string;
}

export class GetResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  itemCode: number;

  @ApiProperty()
  patchable: boolean;
}
