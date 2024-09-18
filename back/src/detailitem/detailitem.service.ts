import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailitemService {
  constructor(
    @InjectRepository(Creation)
    private creationRepository: Repository<Creation>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findOne(id: number) {
    try {
      const listCreation = await this.creationRepository.findOne({
        where: {
          id: id,
        },
      });

      const ingredientlist = await this.ingredientRepository.find({
        where: { creation: { id: listCreation.id } },
      });

      let ingredient = [];

      const calclist: {
        id: number;
        itemName: string;
        currentMinPrice: number;
        createCost: number;
        energy: number;
        createTime: number;
        createBundle: number;
        categoryId: number;
        marketBundle: number;
        icon: string;
        itemCode: number;
      } = {
        id: listCreation.id,
        itemName: listCreation.name,
        currentMinPrice: listCreation.market.currentMinPrice,
        createCost: listCreation.createCost,
        energy: listCreation.energy,
        createTime: listCreation.createTime,
        createBundle: listCreation.createBundle,
        categoryId: listCreation.category.id,
        marketBundle: listCreation.market.bundle,
        icon: listCreation.icon.icon,
        itemCode: listCreation.itemCode,
      };

      for (const calc of ingredientlist) {
        const ca: {
          id: number;
          itemName: string;
          currentMinPrice: number;
          ingredientCount: number;
          bundle: number;
          icon: string;
        } = {
          id: calc.id,
          itemName: calc.market.name,
          currentMinPrice: calc.market.currentMinPrice,
          ingredientCount: calc.ingredientCount,
          bundle: calc.market.bundle,
          icon: calc.market.icon.icon,
        };
        ingredient = [...ingredient, ca];
      }

      return { creation: calclist, ingredient: ingredient };
    } catch (error) {
      return { statusCode: 400, result: 'fail' };
    }
  }
}
