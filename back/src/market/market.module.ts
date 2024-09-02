import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Icon } from 'src/entities/icon.entity';
import { Creation } from 'src/entities/creation.entity';
import { Market } from 'src/entities/market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Ingredient, Icon, Creation, Market]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
