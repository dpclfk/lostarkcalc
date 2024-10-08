import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  itemCode: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon: string;
}
