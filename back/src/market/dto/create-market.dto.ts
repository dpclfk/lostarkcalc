import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  itemCode: number;

  @IsString()
  @IsNotEmpty()
  icon: string;
}
