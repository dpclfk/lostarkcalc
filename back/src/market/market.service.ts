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
      if (
        createMarketDto.icon.indexOf(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/',
        ) !== 0 ||
        createMarketDto.icon.slice(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
        ) === ''
      ) {
        throw Error('imgurl check');
      }

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
        return { statusCode: 405, result: 'duplication Item' };
      } else if (error.message.includes('imgurl check')) {
        return { statusCode: 400, result: 'imgurl check' };
      }
      return { statusCode: 400, result: 'fail' };
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
        const marketobj: {
          id: number;
          name: string;
          icon: string;
          itemCode: number;
          patchable: boolean;
        } = {
          id: market.id,
          name: market.name,
          icon: market.icon.icon,
          itemCode: market.itemCode,
          patchable: market.patchable,
        };
        marketList = [...marketList, marketobj];
      }
      return { marketList };
    } catch (error) {
      console.log(error.message);
      if (error.message === 'empty search') {
        return { statusCode: 400, result: 'empty search' };
      } else {
        return { statusCode: 400, result: 'fail' };
      }
    }
  }

  async update(id: number, updateMarketDto: UpdateMarketDto) {
    try {
      const patchable = await this.marketRepository.findOne({
        where: { id: id },
      });
      if (!patchable.patchable) {
        throw Error('not patch');
      }
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
        return { statusCode: 405, result: 'duplication Item' };
      } else if (error.message.includes('not patch')) {
        return { statusCode: 400, result: 'not fatch' };
      }
      return { statusCode: 400, result: 'fail' };
    }
  }

  async remove(id: number) {
    try {
      const patchable = await this.marketRepository.findOne({
        where: { id: id },
      });
      console.log(patchable);
      if (!patchable.patchable) {
        throw Error('not patch');
      }
      this.marketRepository.delete({ id: id });
      return { result: 'ok' };
    } catch (error) {
      if (error.message.includes('not patch')) {
        return { statusCode: 400, result: 'not fatch' };
      }
      return { statusCode: 400, result: 'fail' };
    }
  }
}
