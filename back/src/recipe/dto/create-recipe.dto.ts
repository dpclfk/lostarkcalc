import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
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

  ingredient: [
    {
      itemName: string;
      ingredientCount: number;
    },
  ];

  // @ValidateNested({ each: true })
  // ingredient: [];
  // // {
  // //   ingredient_count: number;
  // // },

  // @IsNumber()
  // @IsNotEmpty()
  // @Min(1)
  // ingredient_count: number;

  //////////

  // item: {
  //   itemName: string;
  // };
  // ingredient: [
  //   {
  //     itemName: string;
  //     ingredient_count: number;
  //   },
  // ];
}
