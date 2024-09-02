import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Like, Repository } from 'typeorm';
import { Market } from 'src/entities/market.entity';
import { Icon } from 'src/entities/icon.entity';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
    @InjectRepository(Creation)
    private creationRepository: Repository<Creation>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createMarketDto: CreateMarketDto) {
    try {
      let icon = this.iconRepository.create({
        icon: createMarketDto.icon.slice(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
        ),
        itemCode: createMarketDto.itemCode,
      });
      try {
        await this.iconRepository.save(icon);
      } catch (err) {
        icon = await this.iconRepository.findOne({ where: icon });
      }
      const market = this.marketRepository.create({
        name: createMarketDto.itemName,
        itemCode: createMarketDto.itemCode,
        bundle: 1,
        currentMinPrice: 0,
        recentPrice: 0,
        yDayAvgPrice: 0,
        icon: icon,
      });

      await this.marketRepository.save(market);

      return { name: market.name };
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('Duplicate')) {
        return { result: 'duplication Item' };
      }
      return { result: 'fail' };
    }
  }

  async findAll(search: string) {
    try {
      if (!search) {
        throw Error('empty search');
      }
      const findmarket = await this.marketRepository.find({
        where: { name: Like(`%${search}%`) },
      });

      let marketList = [];

      for (const market of findmarket) {
        const marketobj: { name: string; icon: string; itemCode: number } = {
          name: market.name,
          icon: market.icon.icon,
          itemCode: market.itemCode,
        };
        marketList = [...marketList, marketobj];
      }
      return marketList;
    } catch (error) {
      if (error.message === 'empty search') {
        return { result: 'empty search' };
      } else {
        return { result: 'fail' };
      }
    }
  }

  async update(id: number, updateMarketDto: UpdateMarketDto) {
    try {
      let icon = this.iconRepository.create({
        icon: updateMarketDto.icon.slice(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
        ),
        itemCode: updateMarketDto.itemCode,
      });
      try {
        await this.iconRepository.save(icon);
      } catch (err) {
        icon = await this.iconRepository.findOne({ where: icon });
      }
      const market = this.marketRepository.create({
        name: updateMarketDto.itemName,
        itemCode: updateMarketDto.itemCode,
        bundle: 1,
        currentMinPrice: 0,
        recentPrice: 0,
        yDayAvgPrice: 0,
        icon: icon,
      });

      await this.marketRepository.update(id, market);

      return { name: market.name };
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('Duplicate')) {
        return { result: 'duplication Item' };
      }
      return { result: 'fail' };
    }
  }

  remove(id: number) {
    try {
      this.marketRepository.delete({ id: id });
      return { result: 'ok' };
    } catch (error) {
      return { result: 'fail' };
    }
  }
}
