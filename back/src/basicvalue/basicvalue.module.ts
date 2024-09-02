import { Module } from '@nestjs/common';
import { BasicvalueService } from './basicvalue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Icon } from 'src/entities/icon.entity';
import { Creation } from 'src/entities/creation.entity';
import { LastRequest } from 'src/entities/lastRequest.entity';
import { Market } from 'src/entities/market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Ingredient,
      Icon,
      Creation,
      LastRequest,
      Market,
    ]),
  ],
  providers: [BasicvalueService],
})
export class BasicvalueModule {}
